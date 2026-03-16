"""
Batch Audit Router
Bonus PS9: Test multiple AI models simultaneously + Automated testing pipeline
POST /api/audit/batch        — upload multiple CSVs, run all in parallel
GET  /api/audit/batch/{id}   — poll batch status
GET  /api/audit/compare      — compare all completed audits side-by-side
GET  /api/audit/autorun      — trigger automated pipeline on all 4 demo datasets
"""
import os
import json
import threading
from datetime import datetime
from typing import List

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd

from app.core.database import get_db
from app.models.models import AuditRun, FairnessResult
from app.services import audit_service

router = APIRouter(prefix="/api/audit", tags=["batch"])

# ── In-memory batch tracker ───────────────────────────────────────────────────
_batch_jobs: dict = {}   # batch_id → {total, completed, audit_ids, status}


# ── Helper: launch one audit in background thread ────────────────────────────
def _run_in_thread(db_factory, audit_id: int, df: pd.DataFrame, run_name: str):
    db = db_factory()
    try:
        audit_service.process_audit(db, audit_id, df, run_name)
    except Exception as e:
        print(f"❌ Batch audit #{audit_id} failed: {e}")
    finally:
        db.close()


# ── POST /api/audit/batch ─────────────────────────────────────────────────────
@router.post("/batch")
async def batch_upload(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload 2–10 CSV files. All audits start simultaneously in parallel threads.
    Returns a batch_id to poll for progress.
    """
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Upload at least 2 CSV files for batch audit.")
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files per batch.")

    batch_id = f"batch_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
    audit_ids = []

    for file in files:
        # Read CSV
        content = await file.read()
        try:
            df = pd.read_csv(pd.io.common.BytesIO(content))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Cannot parse {file.filename} as CSV.")

        run_name = file.filename.replace(".csv", "").replace("_", " ").title()

        # Create audit record
        audit = AuditRun(
            run_name=run_name,
            file_name=file.filename,
            row_count=len(df),
            status="pending",
        )
        db.add(audit)
        db.commit()
        db.refresh(audit)
        audit_ids.append(audit.id)

        # Launch background thread
        from app.core.database import SessionLocal
        t = threading.Thread(
            target=_run_in_thread,
            args=(SessionLocal, audit.id, df, run_name),
            daemon=True
        )
        t.start()

    # Track batch
    _batch_jobs[batch_id] = {
        "total": len(files),
        "completed": 0,
        "audit_ids": audit_ids,
        "started_at": datetime.utcnow().isoformat(),
        "status": "running"
    }

    return {
        "batch_id": batch_id,
        "total_audits": len(files),
        "audit_ids": audit_ids,
        "message": f"✅ {len(files)} audits started in parallel. Poll /api/audit/batch/{batch_id} for status."
    }


# ── GET /api/audit/batch/{batch_id} ──────────────────────────────────────────
@router.get("/batch/{batch_id}")
def batch_status(batch_id: str, db: Session = Depends(get_db)):
    """Poll batch progress. Returns per-audit status + summary when all done."""
    job = _batch_jobs.get(batch_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch ID not found.")

    audit_ids = job["audit_ids"]
    audits = db.query(AuditRun).filter(AuditRun.id.in_(audit_ids)).all()

    results = []
    completed = 0
    for a in audits:
        if a.status == "completed":
            completed += 1
        results.append({
            "audit_id":     a.id,
            "run_name":     a.run_name,
            "status":       a.status,
            "overall_score": a.overall_score,
            "risk_level":   a.risk_level,
        })

    job["completed"] = completed
    all_done = completed == len(audit_ids)
    job["status"] = "completed" if all_done else "running"

    return {
        "batch_id":   batch_id,
        "total":      job["total"],
        "completed":  completed,
        "status":     job["status"],
        "audits":     results,
        "compare_url": f"/compare?ids={','.join(map(str, audit_ids))}" if all_done else None
    }


# ── GET /api/audit/compare?ids=1,2,3,4 ───────────────────────────────────────
@router.get("/compare")
def compare_audits(ids: str, db: Session = Depends(get_db)):
    """
    Compare multiple completed audits side-by-side.
    Returns scores, dimensions, and compliance for each — ready to render as table.
    """
    try:
        audit_ids = [int(i.strip()) for i in ids.split(",")]
    except ValueError:
        raise HTTPException(status_code=400, detail="ids must be comma-separated integers.")

    from app.models.models import FairnessResult, ComplianceCheck

    audits = db.query(AuditRun).filter(AuditRun.id.in_(audit_ids)).all()
    if not audits:
        raise HTTPException(status_code=404, detail="No audits found.")

    comparison = []
    for a in audits:
        dims = db.query(FairnessResult).filter(FairnessResult.audit_id == a.id).all()
        checks = db.query(ComplianceCheck).filter(ComplianceCheck.audit_id == a.id).all()

        comparison.append({
            "audit_id":     a.id,
            "run_name":     a.run_name,
            "overall_score": a.overall_score,
            "risk_level":   a.risk_level,
            "status":       a.status,
            "dimensions": [
                {
                    "name":   d.dimension_label,
                    "score":  d.score,
                    "passed": d.passed,
                }
                for d in dims
            ],
            "compliance": [
                {
                    "standard":    c.standard,
                    "requirement": c.requirement,
                    "passed":      c.passed,
                }
                for c in checks
            ]
        })

    # Sort by overall_score descending (best model first)
    comparison.sort(key=lambda x: (x["overall_score"] or 0), reverse=True)

    return {
        "total": len(comparison),
        "winner": comparison[0]["run_name"] if comparison else None,
        "audits": comparison
    }


# ── GET /api/audit/autorun ────────────────────────────────────────────────────
@router.get("/autorun")
def autorun_pipeline(db: Session = Depends(get_db)):
    """
    Automated testing pipeline — runs all 4 demo datasets automatically.
    No upload needed. Finds CSVs in /datasets/ folder and audits them all.
    """
    DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "datasets")
    DEMO_FILES = [
        "adult_income.csv",
        "german_credit.csv",
        "compas_recidivism.csv",
        "healthcare_diagnosis.csv",
    ]

    launched = []
    missing = []

    for fname in DEMO_FILES:
        fpath = os.path.join(DATASET_DIR, fname)
        if not os.path.exists(fpath):
            missing.append(fname)
            continue

        df = pd.read_csv(fpath)
        run_name = fname.replace(".csv", "").replace("_", " ").title()

        audit = AuditRun(
            run_name=run_name,
            file_name=fname,
            row_count=len(df),
            
            status="pending",
            
        )
        db.add(audit)
        db.commit()
        db.refresh(audit)

        from app.core.database import SessionLocal
        t = threading.Thread(
            target=_run_in_thread,
            args=(SessionLocal, audit.id, df, run_name),
            daemon=True
        )
        t.start()

        launched.append({"audit_id": audit.id, "dataset": run_name})

    return {
        "pipeline": "automated",
        "launched": launched,
        "missing_files": missing,
        "message": f"✅ Auto-pipeline triggered: {len(launched)} audits running in parallel.",
        "note": "Place CSVs in /datasets/ folder. Poll /api/audit/history for results."
    }

# ── POST /api/audit/regression-test ──────────────────────────────────────────
@router.post("/regression-test")
async def regression_test(
    baseline_file: UploadFile = File(...),
    improved_file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Regression Testing — compare baseline model vs improved model.
    Upload two CSVs: the original (baseline) and the updated (improved) model.
    Returns a detailed diff showing which dimensions improved, degraded, or stayed the same.
    Both audits run in parallel. Returns regression_id to poll for results.
    """
    import uuid
    regression_id = f"regtest_{uuid.uuid4().hex[:12]}"

    results = {}
    audit_ids = {}

    for label, file in [("baseline", baseline_file), ("improved", improved_file)]:
        content = await file.read()
        try:
            import pandas as pd
            df = pd.read_csv(pd.io.common.BytesIO(content))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Cannot parse {file.filename} as CSV.")

        run_name = f"{label.capitalize()} — {file.filename.replace('.csv','')}"

        audit = AuditRun(
            run_name=run_name,
            file_name=file.filename,
            row_count=len(df),
            status="pending",
        )
        db.add(audit)
        db.commit()
        db.refresh(audit)
        audit_ids[label] = audit.id

        from app.core.database import SessionLocal
        t = threading.Thread(
            target=_run_in_thread,
            args=(SessionLocal, audit.id, df, run_name),
            daemon=True
        )
        t.start()

    # Store regression job
    _batch_jobs[regression_id] = {
        "type": "regression",
        "baseline_id": audit_ids["baseline"],
        "improved_id": audit_ids["improved"],
        "status": "running"
    }

    return {
        "regression_id": regression_id,
        "baseline_audit_id": audit_ids["baseline"],
        "improved_audit_id": audit_ids["improved"],
        "message": "✅ Regression test started. Both models auditing in parallel.",
        "poll": f"/api/audit/regression-test/{regression_id}"
    }


@router.get("/regression-test/{regression_id}")
def regression_test_results(regression_id: str, db: Session = Depends(get_db)):
    """
    Poll regression test results.
    Returns detailed diff: which dimensions improved/degraded/stable.
    """
    job = _batch_jobs.get(regression_id)
    if not job or job.get("type") != "regression":
        raise HTTPException(status_code=404, detail="Regression test not found.")

    baseline_id = job["baseline_id"]
    improved_id = job["improved_id"]

    baseline = db.query(AuditRun).filter(AuditRun.id == baseline_id).first()
    improved = db.query(AuditRun).filter(AuditRun.id == improved_id).first()

    if not baseline or not improved:
        raise HTTPException(status_code=404, detail="Audit records not found.")

    # Still processing
    if baseline.status not in ("completed", "failed") or improved.status not in ("completed", "failed"):
        return {
            "status": "running",
            "baseline_status": baseline.status,
            "improved_status": improved.status,
            "message": "Audits still processing..."
        }

    # Get fairness results for both
    baseline_dims = db.query(FairnessResult).filter(FairnessResult.audit_id == baseline_id).all()
    improved_dims = db.query(FairnessResult).filter(FairnessResult.audit_id == improved_id).all()

    baseline_map = {r.dimension: r.score for r in baseline_dims}
    improved_map = {r.dimension: r.score for r in improved_dims}

    # Build diff
    dimension_diff = []
    all_dims = set(list(baseline_map.keys()) + list(improved_map.keys()))

    for dim in all_dims:
        b_score = baseline_map.get(dim, 0)
        i_score = improved_map.get(dim, 0)
        diff = i_score - b_score
        if diff > 3:
            status = "improved"
        elif diff < -3:
            status = "degraded"
        else:
            status = "stable"

        dimension_diff.append({
            "dimension": dim,
            "baseline_score": round(b_score, 2),
            "improved_score": round(i_score, 2),
            "diff": round(diff, 2),
            "status": status
        })

    dimension_diff.sort(key=lambda x: abs(x["diff"]), reverse=True)

    overall_diff = (improved.overall_score or 0) - (baseline.overall_score or 0)
    improved_count = len([d for d in dimension_diff if d["status"] == "improved"])
    degraded_count = len([d for d in dimension_diff if d["status"] == "degraded"])

    if overall_diff > 5:
        verdict = "PASSED"
        verdict_msg = f"✅ Model improved by {overall_diff:.1f} points. Bias reduction confirmed."
    elif overall_diff < -5:
        verdict = "FAILED"
        verdict_msg = f"❌ Model DEGRADED by {abs(overall_diff):.1f} points. Changes made things worse!"
    else:
        verdict = "NEUTRAL"
        verdict_msg = f"⚠️ Minimal change ({overall_diff:+.1f} points). Review individual dimensions."

    return {
        "status": "completed",
        "regression_id": regression_id,
        "verdict": verdict,
        "verdict_message": verdict_msg,
        "overall": {
            "baseline_score": round(baseline.overall_score or 0, 2),
            "improved_score": round(improved.overall_score or 0, 2),
            "diff": round(overall_diff, 2),
            "baseline_risk": baseline.risk_level,
            "improved_risk": improved.risk_level,
        },
        "summary": {
            "improved_dimensions": improved_count,
            "degraded_dimensions": degraded_count,
            "stable_dimensions": len(dimension_diff) - improved_count - degraded_count,
        },
        "dimension_diff": dimension_diff
    }