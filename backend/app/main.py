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