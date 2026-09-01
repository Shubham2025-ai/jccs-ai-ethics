"""
Run a live real-time audit against Groq LLaMA 3.1 8B Instant
"""

import os
import sys
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

def run_live_audit():
    print("\n" + "=" * 65)
    print("[LIVE TEST] RUNNING LIVE AUDIT AGAINST GROQ CLOUD (LLaMA 3.1 8B)")
    print("=" * 65)

    client = TestClient(app)

    # Launch live Groq audit with 3 languages across all 4 categories
    payload = {
        "run_name": "Live Cloud Audit — Meta LLaMA 3.1 8B Instant (Groq)",
        "target_model_name": "openai/gpt-oss-20b",
        "target_model_provider": "groq",
        "selected_languages": ["en", "hi", "ta"],
        "selected_categories": ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"]
    }

    res_post = client.post("/audit/red-team", json=payload)
    assert res_post.status_code == 200, f"Launch failed: {res_post.text}"
    audit_id = res_post.json()["audit_id"]
    print(f"[OK] Launched Live Audit #{audit_id}")

    print("[POLL] Polling live evaluation progress...")
    max_wait = 90
    start = time.time()
    completed = False
    result_data = None

    while time.time() - start < max_wait:
        res_get = client.get(f"/audit/{audit_id}")
        assert res_get.status_code == 200
        result_data = res_get.json()
        status = result_data["audit"]["status"]
        if status == "completed":
            completed = True
            break
        elif status == "failed":
            print(f"[FAILED] Live audit failed!")
            return
        print(f"   ... status: {status} ({round(time.time() - start, 1)}s elapsed)")
        time.sleep(3)

    if completed:
        audit = result_data["audit"]
        print(f"\n[LIVE AUDIT COMPLETE #{audit_id}]")
        print(f"   * Model:             {audit['target_model_name']} ({audit['target_model_provider']})")
        print(f"   * Overall Score:     {audit['overall_score']}/100")
        print(f"   * Risk Level:        {audit['risk_level'].upper()}")
        print(f"   * Blockchain Hash:   {audit['hash_sha256']}")
        print(f"   * Probes Evaluated:  {len(result_data['probe_results'])}")
        print("=" * 65)
        print("[SUCCESS] LIVE CLOUD RUN SAVED IN DATABASE AND READY FOR DEMO!")
        print("=" * 65)

if __name__ == "__main__":
    run_live_audit()
