-- JCCS - Jedi Code Compliance System
-- MySQL 8.0 Database Schema

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
    model_type ENUM('classification', 'regression', 'ranking') DEFAULT 'classification',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    file_name VARCHAR(255),
    row_count INT,
    overall_score FLOAT,
    risk_level ENUM('low', 'medium', 'high', 'critical'),
    hash_sha256 VARCHAR(64),
    blockchain_tx VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- Fairness Dimension Results
CREATE TABLE IF NOT EXISTS fairness_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    dimension VARCHAR(100) NOT NULL,         -- e.g. 'demographic_parity'
    dimension_label VARCHAR(100) NOT NULL,   -- e.g. 'Demographic Parity'
    score FLOAT NOT NULL,                    -- 0-100
    passed BOOLEAN NOT NULL,
    sensitive_attribute VARCHAR(100),        -- e.g. 'gender', 'age'
    metric_value FLOAT,
    threshold FLOAT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- SHAP Feature Importance
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

-- AI Plain Language Explanations
CREATE TABLE IF NOT EXISTS ai_explanations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    explanation_type ENUM('summary', 'bias_finding', 'remediation', 'compliance') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Remediation Suggestions
CREATE TABLE IF NOT EXISTS remediations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    dimension VARCHAR(100),
    suggestion TEXT NOT NULL,
    estimated_bias_reduction FLOAT,
    estimated_accuracy_loss FLOAT,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Compliance Checklist
CREATE TABLE IF NOT EXISTS compliance_checks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_id INT NOT NULL,
    standard VARCHAR(50) NOT NULL,   -- 'EU_AI_ACT', 'DPDP', 'ISO_42001'
    requirement VARCHAR(255) NOT NULL,
    passed BOOLEAN NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- Insert demo organization
INSERT INTO organizations (name, email, api_key) VALUES
('Demo Organization', 'demo@jccs.ai', 'demo-api-key-12345')
ON DUPLICATE KEY UPDATE name = name;
