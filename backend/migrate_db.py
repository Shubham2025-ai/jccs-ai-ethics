"""
Database Schema Migration for LLM Safety Tables
"""

from sqlalchemy import text
from app.core.database import engine, Base
import app.models.models


def migrate():
    print("[MIGRATE] Ensuring all database tables and new columns exist...")
    
    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        # Expand ENUM / small VARCHAR columns across tables
        alter_statements = [
            "ALTER TABLE audit_runs MODIFY COLUMN model_type VARCHAR(100) DEFAULT 'llm_safety'",
            "ALTER TABLE audit_runs MODIFY COLUMN status VARCHAR(100) DEFAULT 'pending'",
            "ALTER TABLE ai_explanations MODIFY COLUMN explanation_type VARCHAR(100)",
            "ALTER TABLE fairness_results MODIFY COLUMN dimension VARCHAR(100)",
            "ALTER TABLE remediations MODIFY COLUMN dimension VARCHAR(100)",
            "ALTER TABLE compliance_checks MODIFY COLUMN standard VARCHAR(100)",
        ]

        for stmt in alter_statements:
            try:
                conn.execute(text(stmt))
                conn.commit()
                print(f"[MIGRATE] Executed: {stmt}")
            except Exception as e:
                print(f"[MIGRATE] Notice on '{stmt}': {e}")

        # Add new columns if missing
        columns_to_add = [
            ("target_model_name", "VARCHAR(255) NULL"),
            ("target_model_provider", "VARCHAR(100) NULL"),
            ("target_model_url", "VARCHAR(500) NULL"),
            # FIX: New audit persistence columns
            ("model_name", "VARCHAR(255) NULL"),
            ("provider", "VARCHAR(100) NULL"),
            ("total_probes", "INT DEFAULT 44"),
            ("probes_passed", "INT DEFAULT 0"),
            ("probes_failed", "INT DEFAULT 0"),
            ("results_json", "LONGTEXT NULL"),
            ("anchor_status", "VARCHAR(50) DEFAULT 'local'"),
        ]

        for col_name, col_type in columns_to_add:
            try:
                conn.execute(text(f"ALTER TABLE audit_runs ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"[MIGRATE] Added column '{col_name}' to audit_runs")
            except Exception as e:
                if "Duplicate column name" in str(e) or "already exists" in str(e):
                    pass
                else:
                    print(f"[MIGRATE] Notice for column '{col_name}': {e}")

    print("[MIGRATE] Database migration complete!")


if __name__ == "__main__":
    migrate()
