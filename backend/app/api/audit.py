"""
API Routes — Audit endpoints
"""
import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.models import AuditRun, FairnessResult, ShapResult, LimeResult, AiExplanation, Remediation, ComplianceCheck
from app.services.audit_service import process_audit

router = APIRouter(prefix="/audit", tags=["Audit"])


def run_audit_sync(audit_id: int, df: pd.DataFrame, run_name: str):
    """Run audit in a fresh DB session (fixes background task session issue)."""
    db = SessionLocal()
    try:
        process_audit(db, audit_id, df, run_name)
    except Exception as e:
        print(f"Audit {audit_id} failed: {e}")
    finally:
        db.close()


@router.post("/upload")
async def upload_and_audit(
    file: UploadFile = File(...),
    run_name: str = Form(default="Audit Run"),
    model_type: str = Form(default="classification"),
    org_id: Optional[int] = Form(default=None),
    db: Session = Depends(get_db)
):
    """Upload CSV and trigger full bias audit synchronously."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.")

    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")

    if df.empty or len(df.columns) < 2:
        raise HTTPException(status_code=400, detail="CSV must have at least 2 columns.")

    # Create audit record
    audit = AuditRun(
        run_name=run_name,
        model_type=model_type,
        status="pending",
        file_name=file.filename,
        row_count=len(df),
        org_id=org_id
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    audit_id = audit.id
    db.close()

    # Run audit synchronously in a fresh session
    import threading
    thread = threading.Thread(target=run_audit_sync, args=(audit_id, df, run_name), daemon=True)
    thread.start()
    # Don't block request — audit runs in background, client polls /audit/{id}

    return {
        "message": "Audit started successfully",
        "audit_id": audit_id,
        "run_name": run_name,
        "row_count": len(df),
        "columns_detected": list(df.columns),
        "status": "processing"
    }


@router.get("/{audit_id}")
def get_audit_result(audit_id: int, db: Session = Depends(get_db)):
    """Get complete audit results by ID."""
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")

    fairness = db.query(FairnessResult).filter(FairnessResult.audit_id == audit_id).all()
    shap = db.query(ShapResult).filter(ShapResult.audit_id == audit_id).order_by(ShapResult.rank_order).all()
    lime = db.query(LimeResult).filter(LimeResult.audit_id == audit_id).order_by(LimeResult.rank_order).all()
    explanations = db.query(AiExplanation).filter(AiExplanation.audit_id == audit_id).all()
    remediations = db.query(Remediation).filter(Remediation.audit_id == audit_id).all()
    compliance = db.query(ComplianceCheck).filter(ComplianceCheck.audit_id == audit_id).all()

    return {
        "audit": {
            "id": audit.id,
            "run_name": audit.run_name,
            "status": audit.status,
            "model_type": audit.model_type,
            "file_name": audit.file_name,
            "row_count": audit.row_count,
            "overall_score": audit.overall_score,
            "risk_level": audit.risk_level,
            "hash_sha256": audit.hash_sha256,
            "blockchain_tx": audit.blockchain_tx,
            "created_at": str(audit.created_at),
            "completed_at": str(audit.completed_at) if audit.completed_at else None,
        },
        "fairness_results": [
            {
                "dimension": r.dimension,
                "dimension_label": r.dimension_label,
                "score": r.score,
                "passed": r.passed,
                "sensitive_attribute": r.sensitive_attribute,
                "metric_value": r.metric_value,
                "threshold": r.threshold,
                "details": r.details
            } for r in fairness
        ],
        "shap_results": [
            {
                "feature_name": s.feature_name,
                "shap_importance": s.shap_importance,
                "rank_order": s.rank_order
            } for s in shap[:15]
        ],
        "lime_results": [
            {
                "feature_name": l.feature_name,
                "lime_importance": l.lime_importance,
                "rank_order": l.rank_order,
                "explanation": l.explanation
            } for l in lime[:10]
        ],
        "explanations": {
            "summary": next((e.content for e in explanations if e.explanation_type == "summary"), ""),
            "remediation_plan": next((e.content for e in explanations if e.explanation_type == "remediation"), ""),
            "bias_findings": [e.content for e in explanations if e.explanation_type == "bias_finding"]
        },
        "model_metrics": __import__('json').loads(next((e.content for e in explanations if e.explanation_type == "model_metrics"), "{}")),
        "remediations": [
            {
                "dimension": r.dimension,
                "suggestion": r.suggestion,
                "estimated_bias_reduction": r.estimated_bias_reduction,
                "estimated_accuracy_loss": r.estimated_accuracy_loss,
                "priority": r.priority
            } for r in remediations
        ],
        "compliance_checks": [
            {
                "standard": c.standard,
                "requirement": c.requirement,
                "passed": c.passed,
                "notes": c.notes
            } for c in compliance
        ]
    }


@router.get("s/list")
def list_audits(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all audit runs."""
    audits = db.query(AuditRun).order_by(AuditRun.created_at.desc()).offset(skip).limit(limit).all()
    return {
        "audits": [
            {
                "id": a.id,
                "run_name": a.run_name,
                "status": a.status,
                "overall_score": a.overall_score,
                "risk_level": a.risk_level,
                "row_count": a.row_count,
                "file_name": a.file_name,
                "created_at": str(a.created_at)
            } for a in audits
        ],
        "total": db.query(AuditRun).count()
    }


@router.delete("/{audit_id}")
def delete_audit(audit_id: int, db: Session = Depends(get_db)):
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found.")
    db.delete(audit)
    db.commit()
    return {"message": f"Audit {audit_id} deleted successfully."}


@router.get("/{audit_id}/verify")
def verify_audit_blockchain(audit_id: int, db: Session = Depends(get_db)):
    """Verify an audit's blockchain certificate — proves tamper-proof integrity."""
    from app.services import blockchain_service
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")

    if not audit.blockchain_tx or not audit.hash_sha256:
        return {"verified": False, "message": "No blockchain record found for this audit."}

    result = blockchain_service.verify_hash(audit.hash_sha256, audit.blockchain_tx)
    parts = audit.blockchain_tx.split("|")
    return {
        "audit_id": audit_id,
        "run_name": audit.run_name,
        "verified": result.get("valid", False),
        "hash_sha256": audit.hash_sha256,
        "blockchain_provider": parts[0] if len(parts) > 0 else "Unknown",
        "blockchain_network": parts[1] if len(parts) > 1 else "Unknown",
        "certificate_id": parts[2] if len(parts) > 2 else "Unknown",
        "anchored_at": parts[3] if len(parts) > 3 else "Unknown",
        "verify_url": result.get("verify_url"),
        "message": result.get("message", "Verification complete.")
    }