-- JCCS - Jedi Code Compliance System
-- IndiaAI LLM Safety & Red-Teaming MySQL 8.0 Database Schema

CREATE DATABASE IF NOT EXISTS jccs_db;
USE jccs_db;

-- Users / Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Runs
CREATE TABLE IF NOT EXISTS audit_runs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT,
    run_name VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) DEFAULT 'llm_safety',
    status VARCHAR(100) DEFAULT 'pending',
    target_model_name VARCHAR(255) NULL,
    target_model_provider VARCHAR(100) NULL,
    target_model_url VARCHAR(500) NULL,
    file_name VARCHAR(255),
    row_count INT,
    overall_score FLOAT,
    risk_level VARCHAR(50),
    hash_sha256 VARCHAR(64),
    blockchain_tx VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- Prompt Evaluation Results (Detailed LLM Red-Teaming Probes)
CREATE TABLE IF NOT EXISTS prompt_evaluation_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    test_id VARCHAR(100) NULL,
    prompt_text TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'en',
    category VARCHAR(100) NOT NULL,
    dimension VARCHAR(100) NOT NULL,
    target_model_response TEXT NULL,
    evaluation_score FLOAT NULL,
    evaluation_notes TEXT NULL,
    concern_category VARCHAR(100) NULL,
    compliant TINYINT(1) NULL,
    meta_info JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Fairness Dimension Results (IndiaAI 9-Dimension Aggregation)
CREATE TABLE IF NOT EXISTS fairness_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    dimension VARCHAR(100) NOT NULL,
    dimension_label VARCHAR(100) NOT NULL,
    score FLOAT NULL,
    passed TINYINT(1) NULL,
    sensitive_attribute VARCHAR(100),
    metric_value FLOAT NULL,
    threshold FLOAT NULL,
    details JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- AI Explanations & Digital Signatures
CREATE TABLE IF NOT EXISTS ai_explanations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    explanation_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Remediation Suggestions & Guardrail Patches
CREATE TABLE IF NOT EXISTS remediations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    dimension VARCHAR(100),
    suggestion TEXT NOT NULL,
    estimated_bias_reduction FLOAT,
    estimated_accuracy_loss FLOAT,
    priority VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Compliance Checklist (MeitY, DPDP, ISO 42001)
CREATE TABLE IF NOT EXISTS compliance_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    standard VARCHAR(100) NOT NULL,
    requirement VARCHAR(255) NOT NULL,
    passed TINYINT(1) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- SHAP / LIME Feature Importance (Tabular Baseline Compatibility)
CREATE TABLE IF NOT EXISTS shap_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    feature_name VARCHAR(255) NOT NULL,
    shap_importance FLOAT NOT NULL,
    mean_abs_shap FLOAT,
    rank_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lime_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    instance_index INT NOT NULL,
    prediction VARCHAR(50),
    probability FLOAT,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Demo organization seed
INSERT INTO organizations (name, email, api_key) VALUES
('IndiaAI Developer Workspace', 'developer@indiaai.gov.in', 'indiaai-demo-key-2026')
ON DUPLICATE KEY UPDATE name = name;
