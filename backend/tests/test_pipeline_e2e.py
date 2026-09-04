"""
End-to-End Test for IndiaAI LLM Safety & Red-Teaming Pipeline
"""

import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
os.environ["USE_SQLITE"] = "true"

from app.core.database import SessionLocal, engine, Base
from app.models.models import AuditRun, FairnessResult, PromptEvaluationResult, ComplianceCheck, Remediation, AiExplanation
from app.services.audit_service import process_llm_safety_audit
from app.services import blockchain_service


def test_full_pipeline():
    print("\n" + "=" * 65)
    print("[TEST] RUNNING END-TO-END INDIAAI SAFETY PIPELINE TEST")
    print("=" * 65)

    # 1. Initialize Tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 2. Create Audit Record
    audit = AuditRun(
        run_name="Sarvam-Indic-2B Demo Safety Audit",
        model_type="llm_safety",
        target_model_name="sarvam-indic-2b",
        target_model_provider="groq",
        file_name="live://groq/sarvam-indic-2b",
        status="pending"
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)
    audit_id = audit.id
    print(f"[OK] Created AuditRun #{audit_id}")

    # 3. Execute Safety Audit on 8 representative probes across English, Hindi, Tamil
    res = process_llm_safety_audit(
        db=db,
        audit_id=audit_id,
        target_model_name="sarvam-indic-2b",
        target_model_provider="groq",
        selected_languages=["en", "hi", "ta"],
        selected_categories=["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"],
        run_name="Sarvam-Indic-2B Demo Safety Audit"
    )

    print(f"\n[SUMMARY] Score={res['overall_score']}/100 | Risk={res['risk_level'].upper()}")

    # 4. Fetch & Validate Database Records
    db.expire_all()
    audit_record = db.query(AuditRun).filter(AuditRun.id == audit_id).first()
    assert audit_record.status == "completed", f"Status should be completed, got {audit_record.status}"
    assert audit_record.overall_score is not None, "Overall score is missing"
    assert audit_record.hash_sha256 is not None, "SHA-256 manifest hash missing"
    assert audit_record.blockchain_tx is not None, "Blockchain TX missing"

    # Dimension Results
    dims = db.query(FairnessResult).filter(FairnessResult.audit_id == audit_id).all()
    print(f"\n[DIMENSIONS] 9 IndiaAI Safety Dimensions ({len(dims)} populated):")
    for d in dims:
        if d.score is not None:
            pass_str = "PASSED" if d.passed else "FAILED"
            print(f"   * {d.dimension_label:<42} : {d.score:>5.1f}/100  [{pass_str}]")
        else:
            print(f"   * {d.dimension_label:<42} :   NOT TESTED  [EXCLUDED]")

    # Probe Results
    probes = db.query(PromptEvaluationResult).filter(PromptEvaluationResult.audit_id == audit_id).all()
    print(f"\n[PROBES] Detailed Test Probes Evaluated ({len(probes)} stored):")
    for p in probes[:4]:
        status = "COMPLIANT" if p.compliant else "VIOLATION"
        score_str = f"{p.evaluation_score:>4.1f}" if p.evaluation_score is not None else " N/A"
        print(f"   [{p.language.upper()}] {p.test_id:<32} Score: {score_str} | {status}")
        print(f"        Notes: {str(p.evaluation_notes or '')[:90]}...")

    # Compliance Checks
    checks = db.query(ComplianceCheck).filter(ComplianceCheck.audit_id == audit_id).all()
    print(f"\n[COMPLIANCE] Regulatory Compliance Checks ({len(checks)} evaluated):")
    for c in checks[:4]:
        c_status = "PASS" if c.passed else "FAIL"
        print(f"   * [{c.standard}] {c.requirement[:55]}... : {c_status}")

    # Digital Signature Verification
    sig_record = db.query(AiExplanation).filter(
        AiExplanation.audit_id == audit_id,
        AiExplanation.explanation_type == "digital_signature"
    ).first()
    if sig_record:
        sig_data = json.loads(sig_record.content)
        ver_res = blockchain_service.verify_digital_signature(
            audit_id=audit_id,
            run_name=audit_record.run_name,
            overall_score=audit_record.overall_score,
            risk_level=audit_record.risk_level,
            sha256_hash=audit_record.hash_sha256,
            issued_at=sig_data.get("issued_at", ""),
            provided_signature=sig_data.get("signature", "")
        )
        msg = str(ver_res.get('message', '')).encode('ascii', 'ignore').decode('ascii')
        print(f"\n[CRYPTO] Digital Signature Verification: {msg}")
        assert ver_res.get("valid") is True, "Digital signature verification failed!"

    db.close()
    print("\n" + "=" * 65)
    print("[SUCCESS] ALL END-TO-END PIPELINE CHECKS PASSED SUCCESSFULLY!")
    print("=" * 65)


if __name__ == "__main__":
    test_full_pipeline()
