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