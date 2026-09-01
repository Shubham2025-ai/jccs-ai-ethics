"""
API Routes — LLM Safety & Red-Teaming Audit Endpoints
"""

import io
import json
import threading
import pandas as pd
from pydantic import BaseModel
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Body
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.models import (
    AuditRun,
    PromptEvaluationResult,
    FairnessResult,
    AiExplanation,
    Remediation,
    ComplianceCheck,
    ShapResult,
    LimeResult,
)
from app.services.audit_service import process_llm_safety_audit, process_audit
from app.services import llm_client

router = APIRouter(prefix="/audit", tags=["Audit"])


def run_llm_audit_sync(
    audit_id: int,
    target_model_name: str,
    target_model_provider: str,
    target_model_url: Optional[str],
    api_key: Optional[str],
    selected_languages: List[str],
    selected_categories: List[str],
    run_name: str
):
    """Executes LLM safety audit in isolated background DB session."""
    db = SessionLocal()
    try:
        process_llm_safety_audit(
            db=db,
            audit_id=audit_id,
            target_model_name=target_model_name,
            target_model_provider=target_model_provider,
            target_model_url=target_model_url,
            api_key=api_key,
            selected_languages=selected_languages,
            selected_categories=selected_categories,
            run_name=run_name
        )
    except Exception as e:
        print(f"❌ LLM Safety Audit {audit_id} failed: {e}")
    finally:
        db.close()


def run_tabular_audit_sync(audit_id: int, df: pd.DataFrame, run_name: str):
    """Legacy tabular background worker."""
    db = SessionLocal()
    try:
        process_audit(db, audit_id, df, run_name)
    except Exception as e:
        print(f"❌ Tabular Audit {audit_id} failed: {e}")
    finally:
        db.close()


# =========================================================================
# 1. NEW ENDPOINT: /audit/test-target-connection (Direct Live Probe)
# =========================================================================

class TestConnectionRequest(BaseModel):
    target_model_name: Optional[str] = "sarvam-105b"
    target_model_provider: str = "sarvam"
    target_model_url: Optional[str] = None
    api_key: Optional[str] = None


@router.post("/test-target-connection")
async def test_target_connection(req: TestConnectionRequest = Body(...)):
    """
    Directly tests connectivity to a live target LLM endpoint WITHOUT fallback simulation.
    Returns real HTTP status code and response from the upstream provider.
    """
    res = await llm_client.test_direct_connection(
        model_name=req.target_model_name,
        provider=req.target_model_provider,
        base_url=req.target_model_url,
        api_key=req.api_key
    )
    return res


# =========================================================================
# 2. ENDPOINT: /audit/red-team (LLM Safety Audit)
# =========================================================================

class RedTeamAuditRequest(BaseModel):
    run_name: Optional[str] = "IndiaAI Safety Audit"
    target_model_name: str = "openai/gpt-oss-20b"
    target_model_provider: str = "groq"
    target_model_url: Optional[str] = None
    api_key: Optional[str] = None
    selected_languages: Optional[List[str]] = ["en", "hi", "ta"]
    selected_categories: Optional[List[str]] = ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"]
    org_id: Optional[int] = None


@router.post("/red-team")
def start_red_team_audit(
    req: RedTeamAuditRequest = Body(...),
    db: Session = Depends(get_db)
):
    """
    Launches an automated IndiaAI red-teaming audit against a target LLM.
    Evaluates across Caste, Gender, Regional/Religious harmony, and Jailbreaks in 3 Indic languages.
    """
    run_name = req.run_name or f"{req.target_model_name} Safety Audit"

    audit = AuditRun(
        run_name=run_name,
        model_type="llm_safety",
        target_model_name=req.target_model_name,
        target_model_provider=req.target_model_provider,
        target_model_url=req.target_model_url,
        file_name=f"live://{req.target_model_provider}/{req.target_model_name}",
        status="pending",
        org_id=req.org_id
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    audit_id = audit.id
    db.close()

    # Launch background thread
    t = threading.Thread(
        target=run_llm_audit_sync,
        args=(
            audit_id,
            req.target_model_name,
            req.target_model_provider,
            req.target_model_url,
            req.api_key,
            req.selected_languages or ["en", "hi", "ta"],
            req.selected_categories or ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"],
            run_name
        ),
        daemon=True
    )
    t.start()

    return {
        "message": f"✅ IndiaAI Safety Red-Team audit started for {req.target_model_name}",
        "audit_id": audit_id,
        "run_name": run_name,
        "target_model": req.target_model_name,
        "provider": req.target_model_provider,
        "status": "processing",
        "languages_tested": req.selected_languages,
        "categories_tested": req.selected_categories
    }


# =========================================================================
# 2. GET AUDIT RESULTS (Compatible with both LLM & Tabular Scorecards)
# =========================================================================

@router.get("/{audit_id}")
def get_audit_result(audit_id: int, db: Session = Depends(get_db)):
    """Get complete audit results & IndiaAI scorecard by ID."""
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")

    fairness = db.query(FairnessResult).filter(FairnessResult.audit_id == audit_id).all()
    probes = db.query(PromptEvaluationResult).filter(PromptEvaluationResult.audit_id == audit_id).order_by(PromptEvaluationResult.created_at.asc()).all()
    explanations = db.query(AiExplanation).filter(AiExplanation.audit_id == audit_id).all()
    remediations = db.query(Remediation).filter(Remediation.audit_id == audit_id).all()
    compliance = db.query(ComplianceCheck).filter(ComplianceCheck.audit_id == audit_id).all()

    # Digitize digital signature if present
    sig_raw = next((e.content for e in explanations if e.explanation_type == "digital_signature"), "{}")
    try:
        digital_signature = json.loads(sig_raw)
    except Exception:
        digital_signature = {"valid": False}

    return {
        "audit": {
            "id": audit.id,
            "run_name": audit.run_name,
            "status": audit.status,
            "model_type": audit.model_type,
            "target_model_name": audit.target_model_name,
            "target_model_provider": audit.target_model_provider,
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
                "metric_value": r.metric_value,
                "threshold": r.threshold,
                "details": r.details
            } for r in fairness
        ],
        "probe_results": [
            {
                "id": p.id,
                "test_id": p.test_id,
                "prompt_text": p.prompt_text,
                "language": p.language,
                "category": p.category,
                "dimension": p.dimension,
                "target_model_response": p.target_model_response,
                "evaluation_score": p.evaluation_score,
                "evaluation_notes": p.evaluation_notes,
                "concern_category": p.concern_category,
                "compliant": p.compliant,
                "meta_info": p.meta_info
            } for p in probes
        ],
        "explanations": {
            "summary": next((e.content for e in explanations if e.explanation_type == "summary"), ""),
            "remediation_plan": next((e.content for e in explanations if e.explanation_type == "remediation"), ""),
        },
        "digital_signature": digital_signature,
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


# =========================================================================
# 3. LIST, DELETE & VERIFICATION ENDPOINTS
# =========================================================================

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
                "model_type": a.model_type,
                "target_model_name": a.target_model_name,
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


@router.post("/{audit_id}/verify-signature")
def verify_audit_signature(audit_id: int, db: Session = Depends(get_db)):
    """Verify the digital signature of an audit certificate."""
    from app.services import blockchain_service
    audit = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail=f"Audit {audit_id} not found.")

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


# =========================================================================
# 4. LEGACY CSV UPLOAD (Retained for Backward Compatibility)
# =========================================================================

@router.post("/upload")
async def upload_and_audit(
    file: UploadFile = File(...),
    run_name: str = Form(default="Tabular Audit Run"),
    model_type: str = Form(default="classification"),
    org_id: Optional[int] = Form(default=None),
    db: Session = Depends(get_db)
):
    """Upload CSV and trigger tabular bias audit."""
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

    thread = threading.Thread(target=run_tabular_audit_sync, args=(audit_id, df, run_name), daemon=True)
    thread.start()

    return {
        "message": "Tabular audit started successfully",
        "audit_id": audit_id,
        "run_name": run_name,
        "row_count": len(df),
        "status": "processing"
    }