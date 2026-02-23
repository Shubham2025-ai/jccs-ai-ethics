from sqlalchemy import Column, Integer, String, Float, Boolean, Text, JSON, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# NOTE: Using String instead of Enum — works on both SQLite and MySQL

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    api_key = Column(String(64), unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audits = relationship("AuditRun", back_populates="organization")

class AuditRun(Base):
    __tablename__ = "audit_runs"
    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    run_name = Column(String(255), nullable=False)
    model_type = Column(String(50), default="classification")   # classification/regression/ranking
    status = Column(String(50), default="pending")              # pending/processing/completed/failed
    file_name = Column(String(255))
    row_count = Column(Integer)
    overall_score = Column(Float)
    risk_level = Column(String(20))                             # low/medium/high/critical
    hash_sha256 = Column(String(64))
    blockchain_tx = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    completed_at = Column(TIMESTAMP, nullable=True)

    organization = relationship("Organization", back_populates="audits")
    fairness_results = relationship("FairnessResult", back_populates="audit", cascade="all, delete")
    shap_results = relationship("ShapResult", back_populates="audit", cascade="all, delete")
    lime_results = relationship("LimeResult", back_populates="audit", cascade="all, delete")
    ai_explanations = relationship("AiExplanation", back_populates="audit", cascade="all, delete")
    remediations = relationship("Remediation", back_populates="audit", cascade="all, delete")
    compliance_checks = relationship("ComplianceCheck", back_populates="audit", cascade="all, delete")

class FairnessResult(Base):
    __tablename__ = "fairness_results"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    dimension = Column(String(100), nullable=False)
    dimension_label = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    passed = Column(Boolean, nullable=False)
    sensitive_attribute = Column(String(100))
    metric_value = Column(Float)
    threshold = Column(Float)
    details = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="fairness_results")

class ShapResult(Base):
    __tablename__ = "shap_results"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    feature_name = Column(String(255), nullable=False)
    shap_importance = Column(Float, nullable=False)
    mean_abs_shap = Column(Float)
    rank_order = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="shap_results")



class LimeResult(Base):
    __tablename__ = "lime_results"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    feature_name = Column(String(255), nullable=False)
    lime_importance = Column(Float, nullable=False)
    rank_order = Column(Integer)
    explanation = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="lime_results")

class AiExplanation(Base):
    __tablename__ = "ai_explanations"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    explanation_type = Column(String(50), nullable=False)   # summary/bias_finding/remediation/compliance
    content = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="ai_explanations")

class Remediation(Base):
    __tablename__ = "remediations"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    dimension = Column(String(100))
    suggestion = Column(Text, nullable=False)
    estimated_bias_reduction = Column(Float)
    estimated_accuracy_loss = Column(Float)
    priority = Column(String(20), default="medium")         # high/medium/low
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="remediations")

class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"
    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, ForeignKey("audit_runs.id"), nullable=False)
    standard = Column(String(50), nullable=False)
    requirement = Column(String(255), nullable=False)
    passed = Column(Boolean, nullable=False)
    notes = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    audit = relationship("AuditRun", back_populates="compliance_checks")