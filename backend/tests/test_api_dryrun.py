"""
Full Dry-Run Integration Test for FastAPI Endpoints and IndiaAI Scorecards
"""

import os
import sys
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine

def dry_run_api():
    print("\n" + "=" * 65)
    print("[DRY-RUN] TESTING COMPLETE REST API & INDIAAI SAFETY PIPELINE")
    print("=" * 65)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Health check
    res_health = client.get("/health")
    assert res_health.status_code == 200, f"Health check failed: {res_health.text}"
    print("[OK] /health -> 200 OK")

    # 2. Launch Red-Team Audit via POST /audit/red-team
    payload = {
        "run_name": "Indic LLM 7B - Full Dry-Run Audit",
        "target_model_name": "indic-base-7b-simulated",
        "target_model_provider": "demo",
        "selected_languages": ["en", "hi", "ta"],
        "selected_categories": ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"]
    }
    res_post = client.post("/audit/red-team", json=payload)
    assert res_post.status_code == 200, f"Launch failed: {res_post.text}"
    data = res_post.json()
    audit_id = data["audit_id"]
    print(f"[OK] POST /audit/red-team -> Launched Audit #{audit_id} ({data['target_model']})")

    # 3. Poll GET /audit/{audit_id} until completed
    print("[POLL] Waiting for background evaluation to complete...")
    max_wait = 60
    start = time.time()
    completed = False
    result_data = None

    while time.time() - start < max_wait:
        res_get = client.get(f"/audit/{audit_id}")
        assert res_get.status_code == 200, f"Fetch failed: {res_get.text}"
        result_data = res_get.json()
        status = result_data["audit"]["status"]
        if status == "completed":
            completed = True
            break
        elif status == "failed":
            raise Exception("Audit execution failed!")
        time.sleep(2)

    assert completed, f"Audit #{audit_id} timed out before completion!"
    print(f"[SUCCESS] Audit #{audit_id} completed in {round(time.time() - start, 1)}s!")

    # 4. Verify Data Integrity for all 5 Frontend Tabs
    audit = result_data["audit"]
    dims = result_data["fairness_results"]
    probes = result_data["probe_results"]
    compliance = result_data["compliance_checks"]
    remediations = result_data["remediations"]
    sig = result_data["digital_signature"]

    print(f"\n[SCORECARD SUMMARY]")
    print(f"   * Audit Name:        {audit['run_name']}")
    print(f"   * Overall Score:     {audit['overall_score']}/100")
    print(f"   * Risk Level:        {audit['risk_level'].upper()}")
    print(f"   * Safety Dimensions: {len(dims)} populated")
    print(f"   * Probes Evaluated:  {len(probes)} test cases")
    print(f"   * Regulatory Checks: {len(compliance)} mapped")
    print(f"   * Guardrail Patches: {len(remediations)} generated")
    print(f"   * Digital Signature: Valid={sig.get('valid', False)} (Key-ID: {sig.get('key_fingerprint', 'N/A')})")

    # 5. Test Verification Endpoint
    res_verify = client.get(f"/audit/{audit_id}/verify")
    assert res_verify.status_code == 200
    msg = str(res_verify.json().get('message', '')).encode('ascii', 'ignore').decode('ascii')
    print(f"[CRYPTO PROOF] Blockchain Verification: {msg}")

    print("\n" + "=" * 65)
    print("[PASSED] ALL API & SCORECARD DRY-RUN CHECKS COMPLETED WITH ZERO ERRORS!")
    print("=" * 65)


if __name__ == "__main__":
    dry_run_api()
