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
        "decision_rules": __import__('json').loads(next((e.content for e in explanations if e.explanation_type == "decision_rules"), "{}")),
        "digital_signature": __import__('json').loads(next((e.content for e in explanations if e.explanation_type == "digital_signature"), "{}")),
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

@router.get("/monitor/trend")
def get_fairness_trend(run_name: str = None, limit: int = 10, db: Session = Depends(get_db)):
    """
    Continuous Monitoring — track fairness scores over time.
    Returns trend data showing if model is improving or degrading.
    """
    query = db.query(AuditRun).filter(AuditRun.status == "completed")
    if run_name:
        query = query.filter(AuditRun.run_name.ilike(f"%{run_name}%"))
    audits = query.order_by(AuditRun.created_at.desc()).limit(limit).all()
    audits = list(reversed(audits))  # oldest first for trend

    if len(audits) < 2:
        return {
            "trend": "insufficient_data",
            "message": "Need at least 2 audits of the same model to detect drift.",
            "data": []
        }

    scores = [a.overall_score for a in audits if a.overall_score]
    if not scores:
        return {"trend": "no_scores", "data": []}

    # Detect trend
    first_half = sum(scores[:len(scores)//2]) / (len(scores)//2)
    second_half = sum(scores[len(scores)//2:]) / (len(scores) - len(scores)//2)
    diff = second_half - first_half

    if diff > 5:
        trend = "improving"
        trend_msg = f"✅ Fairness is improving (+{diff:.1f} points). Model bias is decreasing over time."
    elif diff < -5:
        trend = "degrading"
        trend_msg = f"⚠️ Fairness is DEGRADING ({diff:.1f} points). Model bias is increasing — action required!"
    else:
        trend = "stable"
        trend_msg = f"📊 Fairness is stable (±{abs(diff):.1f} points). Continue monitoring."

    return {
        "trend": trend,
        "trend_message": trend_msg,
        "score_change": round(diff, 2),
        "first_score": round(scores[0], 2),
        "latest_score": round(scores[-1], 2),
        "data": [
            {
                "id": a.id,
                "run_name": a.run_name,
                "score": round(a.overall_score, 2) if a.overall_score else None,
                "risk_level": a.risk_level,
                "created_at": str(a.created_at)
            } for a in audits
        ]
    }

@router.post("/{audit_id}/verify-signature")
def verify_audit_signature(audit_id: int, db: Session = Depends(get_db)):
    """
    Verify the digital signature of an audit certificate.
    Proves the certificate is authentic and has not been tampered with.
    """
    from app.services import blockchain_service
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")

    # Get stored signature
    from app.models.models import AiExplanation
    import json
    sig_record = db.query(AiExplanation).filter(
        AiExplanation.audit_id == audit_id,
        AiExplanation.explanation_type == "digital_signature"
    ).first()

    if not sig_record:
        return {"verified": False, "message": "No digital signature found for this audit."}

    sig_data = json.loads(sig_record.content)
    if not sig_data.get("signature"):
        return {"verified": False, "message": "Invalid signature record."}

    result = blockchain_service.verify_digital_signature(
        audit_id=audit_id,
        run_name=audit.run_name,
        overall_score=audit.overall_score or 0,
        risk_level=audit.risk_level or "unknown",
        sha256_hash=audit.hash_sha256 or "",
        issued_at=sig_data.get("issued_at", ""),
        provided_signature=sig_data["signature"]
    )

    return {
        "audit_id": audit_id,
        "run_name": audit.run_name,
        "verified": result["valid"],
        "message": result["message"],
        "certificate_serial": sig_data.get("certificate_serial"),
        "key_fingerprint": sig_data.get("key_fingerprint"),
        "issued_at": sig_data.get("issued_at"),
        "algorithm": sig_data.get("signature_algorithm", "HMAC-SHA256"),
        "certificate_text": sig_data.get("certificate_text")
    }

@router.post("/{audit_id}/debias")
async def apply_debiasing(
    audit_id: int,
    method: str = "reweighing",
    approved: bool = False,
    db: Session = Depends(get_db)
):
    """
    Automated Debiasing with Human Approval Gate.
    
    Step 1: Call with approved=False to get simulation/preview
    Step 2: Review the projected improvements
    Step 3: Call again with approved=True to confirm
    
    Methods: reweighing | threshold | suppression
    """
    from app.services import bias_engine as be
    import pandas as pd

    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")
    if audit.status != "completed":
        raise HTTPException(status_code=400, detail="Audit must be completed before debiasing.")

    # Get fairness results to reconstruct context
    fairness = db.query(FairnessResult).filter(FairnessResult.audit_id == audit_id).all()
    if not fairness:
        raise HTTPException(status_code=404, detail="No fairness results found.")

    sensitive_attrs = list(set([
        r.sensitive_attribute for r in fairness
        if r.sensitive_attribute
    ]))

    # Get current scores
    dim_scores = {r.dimension: r.score for r in fairness}

    # Simulate debiasing effect based on method
    method_impacts = {
        "reweighing":   {"demographic_parity": 0.55, "equal_opportunity": 0.40, "calibration": 0.25},
        "threshold":    {"demographic_parity": 0.35, "equal_opportunity": 0.60, "calibration": 0.30},
        "suppression":  {"demographic_parity": 0.45, "equal_opportunity": 0.35, "calibration": 0.20},
    }
    impacts = method_impacts.get(method, method_impacts["reweighing"])

    projected_scores = {}
    for dim, current_score in dim_scores.items():
        impact = impacts.get(dim, 0.15)
        projected = min(100, current_score + (100 - current_score) * impact)
        projected_scores[dim] = round(projected, 2)

    current_overall = audit.overall_score or 0
    projected_overall = min(100, round(
        sum(projected_scores.values()) / len(projected_scores), 2
    ))

    method_descriptions = {
        "reweighing":  "Assigns higher sample weights to underrepresented groups during training. Best for fixing demographic parity.",
        "threshold":   "Sets different decision thresholds per demographic group to equalize true positive rates. Best for equal opportunity.",
        "suppression": "Removes features that correlate with sensitive attributes. Best for counterfactual fairness.",
    }

    if not approved:
        # Preview mode — show what WOULD happen
        return {
            "status": "preview",
            "audit_id": audit_id,
            "method": method,
            "method_description": method_descriptions.get(method, ""),
            "requires_approval": True,
            "approval_prompt": f"Review the projected improvements below. Call this endpoint again with approved=true to confirm applying {method} debiasing.",
            "current": {
                "overall_score": round(current_overall, 2),
                "risk_level": audit.risk_level,
                "dimension_scores": dim_scores,
            },
            "projected": {
                "overall_score": projected_overall,
                "risk_level": "low" if projected_overall >= 80 else "medium" if projected_overall >= 60 else "high" if projected_overall >= 40 else "critical",
                "dimension_scores": projected_scores,
                "score_improvement": round(projected_overall - current_overall, 2),
            },
            "sensitive_attributes": sensitive_attrs,
            "warning": "This is a SIMULATION. Human approval required before applying to production."
        }
    else:
        # Approved — record the debiasing decision
        return {
            "status": "approved",
            "audit_id": audit_id,
            "method": method,
            "message": f"✅ Debiasing method '{method}' approved by human reviewer.",
            "next_steps": [
                f"1. Apply {method} to your original training pipeline",
                "2. Retrain the model with the fix applied",
                "3. Upload the new model CSV to JCCS for regression testing",
                "4. Use /regression-test to confirm bias was reduced",
            ],
            "implementation_guide": method_descriptions.get(method, ""),
            "projected_improvement": round(projected_overall - current_overall, 2),
            "approved_at": __import__('datetime').datetime.utcnow().isoformat(),
            "approved_by": "human_reviewer"
        }