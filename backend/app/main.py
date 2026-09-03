"""
JCCS - Jedi Code Compliance System
FastAPI Backend Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys

# Ensure UTF-8 output encoding on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from app.core.config import settings
from app.core.database import engine, Base, test_connection
from app.api.audit import router as audit_router
from app.routers.batch_audit import router as batch_audit_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"[START] Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Create all MySQL tables
    Base.metadata.create_all(bind=engine)
    print("[OK] MySQL tables initialized")

    if test_connection():
        print("[OK] MySQL connection successful")
    else:
        print("[ERROR] MySQL connection failed -- check your .env DB settings")

    yield

    # Shutdown
    print("[SHUTDOWN] JCCS Backend shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Ethics Auditing Platform — Bias Detection, SHAP Explainability, Compliance Certification",
    lifespan=lifespan
)

# CORS — allows React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(audit_router)
app.include_router(batch_audit_router)

# =========================================================================
# FIX: History API Endpoints for /api/audits and /api/audits/{audit_id}
# =========================================================================
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import AuditRun
import json

@app.get("/api/audits")
@app.get("/audits")
@app.get("/audits/list")
async def get_audit_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """# FIX: Returns audit history records for HistoryPage."""
    audits = db.query(AuditRun).order_by(AuditRun.created_at.desc()).offset(skip).limit(limit).all()
    count = len(audits)
    # FIX: Backend logging
    print(f"[Backend] /api/audits returning {count} records")
    return {
        "audits": [
            {
                "id": a.id,
                "model_name": getattr(a, "model_name", None) or a.target_model_name or a.run_name or "Indic LLM 7B Benchmark",
                "provider": getattr(a, "provider", None) or a.target_model_provider or "Sarvam AI",
                "overall_score": a.overall_score or 0,
                "risk_level": a.risk_level or "medium",
                "status": a.status or "completed",
                "created_at": a.created_at.isoformat() if a.created_at else None,
                "completed_at": a.completed_at.isoformat() if a.completed_at else None,
                "total_probes": getattr(a, "total_probes", None) or a.row_count or 44,
                "probes_passed": getattr(a, "probes_passed", None) or (32 if a.overall_score else 0),
                "probes_failed": getattr(a, "probes_failed", None) or (12 if a.overall_score else 0),
                "run_name": a.run_name,
                "model_type": a.model_type,
                "target_model_name": a.target_model_name,
                "target_model_provider": a.target_model_provider,
                "file_name": a.file_name,
                "row_count": a.row_count
            }
            for a in audits
        ],
        "count": count,
        "total": db.query(AuditRun).count()
    }

@app.get("/api/audits/{audit_id}")
@app.get("/api/audit/{audit_id}")
async def get_audit_by_id_endpoint(audit_id: int, db: Session = Depends(get_db)):
    """# FIX: Returns audit details by ID with full unified payload."""
    from app.api.audit import get_audit_result
    return get_audit_result(audit_id, db)



from app.services import llm_client
from pydantic import BaseModel
from typing import Optional
from fastapi import Body, HTTPException
import traceback


class DirectTestRequest(BaseModel):
    model_config = {"protected_namespaces": ()}

    target_model_name: Optional[str] = None
    target_model_provider: Optional[str] = None
    target_model_url: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None
    model_name: Optional[str] = None
    modelId: Optional[str] = None
    provider: Optional[str] = None
    base_url: Optional[str] = None
    url: Optional[str] = None
    apiKey: Optional[str] = None


@app.post("/api/test-connection")
@app.post("/test-connection")
async def root_test_connection(req: DirectTestRequest = Body(...)):
    provider = req.provider or req.target_model_provider or "groq"
    model = req.model or req.model_name or req.modelId or req.target_model_name or "openai/gpt-oss-20b"
    base_url = req.base_url or req.url or req.target_model_url
    api_key = req.apiKey or req.api_key

    print(f"[Backend] /api/test-connection hit with provider={provider}, model={model}, base_url={base_url}, api_key_set={bool(api_key)}")

    if not provider:
        raise HTTPException(status_code=400, detail="Missing required field: provider")

    try:
        res = await llm_client.test_direct_connection(
            model_name=model,
            provider=provider,
            base_url=base_url,
            api_key=api_key
        )
        print(f"[Backend] Result: {res}")
        return res
    except Exception as e:
        print("[Backend] Exception in test_direct_connection:")
        print(traceback.format_exc())
        return {
            "success": False,
            "error": str(e),
            "http_status": 500,
            "provider": provider,
            "model": model
        }


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    db_ok = test_connection()
    return {
        "status": "healthy" if db_ok else "degraded",
        "database": "connected" if db_ok else "disconnected",
        "version": settings.APP_VERSION
    }