# 🛡️ JCCS — Jedi Code Compliance System

**Ethical AI Auditing Framework — Bluebit Hackathon 4.0 | PS9 | Round 3 Finalist**

> *"The Force will be with you, always — but your AI model? That needs an audit."*

🌐 **Live Demo:** [jccs-ai-ethics.vercel.app](https://jccs-ai-ethics.vercel.app) &nbsp;|&nbsp; 🔗 **Backend:** [jccs-ai-ethics.onrender.com](https://jccs-ai-ethics.onrender.com/health) &nbsp;|&nbsp; 🎬 **Demo:** [youtu.be/-OjU0iuaYBY](https://youtu.be/-OjU0iuaYBY)

---

## 🎬 Demo Video

▶️ **[Watch 4-Minute Demo on YouTube](https://youtu.be/-OjU0iuaYBY)**

---

## 📌 Problem Statement

**PS9 — Jedi Code Compliance System: Ethical AI Auditing Framework**

AI systems are making life-altering decisions in hiring, healthcare, criminal justice, and credit scoring — yet most organisations have no way to audit these systems for bias or fairness.

**JCCS solves this:** upload any AI model's predictions as a CSV and get a complete, blockchain-certified bias audit report in **under 60 seconds** — no code required.

---

## ✨ Features

### Mandatory PS9 Deliverables — All Implemented

| Requirement | Status | Implementation |
|---|---|---|
| Hiring / Healthcare / Criminal Justice domains | ✅ | 4 domains: Income, Credit, COMPAS, Healthcare |
| Demographic Parity | ✅ | Fairlearn statistical gap analysis |
| Equal Opportunity | ✅ | True positive rate parity across groups |
| Calibration | ✅ | Confidence-outcome alignment (AIF360) |
| Privacy Preservation | ✅ | PII detection + data leakage checks |
| Transparency / Interpretability | ✅ | SHAP (global) + LIME (local) XAI |
| Show WHY model made specific decisions | ✅ | Per-prediction LIME feature attribution |
| Feature Importance Visualization | ✅ | Interactive SHAP bar + LIME charts |
| Visual Scorecard (Pass / Fail) | ✅ | Per-criterion compliance cards |
| Bias Instances Highlighted | ✅ | Top-3 most discriminatory features flagged |
| Recommendations for Improvement | ✅ | Domain-specific remediation per violation |

### Round 3 Additions — All Implemented ⭐

| Requirement | Status | Implementation |
|---|---|---|
| Multi-Dimensional Ethical Scoring (9 dimensions) | ✅ | Fairness + Privacy + Robustness + Accountability |
| Automated Testing Pipeline with CI/CD gates | ✅ | BLOCKED/APPROVED deployment gates |
| Regression Testing | ✅ | Baseline vs improved model comparison |
| Deep Explainability — Counterfactuals | ✅ | "What would change your outcome?" |
| Decision Tree Rule Extraction | ✅ | IF-THEN human-readable rules |
| Bias Remediation Toolkit | ✅ | Reweighing, Threshold, Suppression |
| Before/After Metrics | ✅ | Projected score improvement per dimension |
| Automated Debiasing + Human Approval | ✅ | Simulate → Review → Approve workflow |
| Stakeholder Reports (4 views) | ✅ | Executive, Developer, Regulator, End-User |
| Continuous Monitoring + Drift Detection | ✅ | Trend chart, Improving/Degrading alerts |
| Digital Signatures + Verification | ✅ | HMAC-SHA256 certificate signing |
| Certification System | ✅ | PDF + Blockchain + Digital Signature |

### Bonus Points — Both Achieved ⭐⭐

| Bonus | Status | How |
|---|---|---|
| Test multiple AI models simultaneously | ✅ | Upload 2–10 CSVs → all audited in parallel threads |
| Automated testing pipeline | ✅ | One click → auto-fetches 4 datasets → CI/CD pipeline report |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  JCCS Full Stack                         │
├─────────────────────────────────────────────────────────┤
│  Frontend  React 18 + Vite + TailwindCSS                 │
│  ├── HomePage      — Live bias preview card              │
│  ├── UploadPage    — CSV upload + progress bar           │
│  ├── ResultsPage   — 7 tabs: Overview, Fairness,        │
│  │                   Explainability, Compliance,         │
│  │                   Remediation, Reports, Before/After  │
│  ├── HistoryPage   — Continuous monitoring dashboard     │
│  ├── ComparePage   — Multi-model comparison + CI/CD      │
│  └── RegressionPage — Baseline vs improved testing       │
├─────────────────────────────────────────────────────────┤
│  Backend  FastAPI + Python 3.11                          │
│  ├── bias_engine.py        — 9 fairness dimensions       │
│  ├── audit_service.py      — Full pipeline orchestration │
│  ├── groq_service.py       — AI summaries (LLaMA 3)     │
│  ├── batch_audit.py        — Parallel + regression test  │
│  └── blockchain_service.py — SHA-256 + Digital Signature │
├─────────────────────────────────────────────────────────┤
│  Database  PostgreSQL (prod) / SQLite (local)            │
│  ML        Fairlearn · AIF360 · SHAP · LIME              │
│            DecisionTreeClassifier (Rule Extraction)      │
│  AI        Groq API (LLaMA 3 70B)                        │
│  Chain     SHA-256 + OriginStamp Bitcoin blockchain      │
│  Crypto    HMAC-SHA256 Digital Signatures                │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 How the ML Model Works

1. **Upload CSV** → FastAPI receives file, creates audit record
2. **Column Detection** → Auto-identifies sensitive attributes, outcome column, domain
3. **Proxy Model** → RandomForestClassifier (classification/ranking) or RandomForestRegressor (regression) trained on 80% of data with 20% held-out test set
4. **9 Fairness Dimensions** → Fairlearn + AIF360 compute disparity metrics per group
5. **SHAP Analysis** → TreeExplainer → global feature importance
6. **LIME Analysis** → Perturbation-based → individual decision explanation
7. **Rule Extraction** → DecisionTree (depth=4) → IF-THEN human-readable rules
8. **Score Calculation** → Weighted average of 9 dimensions (weights differ by model type)
9. **AI Summary** → LLaMA 3 70B generates plain-English findings + remediation plan
10. **Compliance Mapping** → 14 checks across EU AI Act, DPDP, ISO 42001
11. **Digital Signature** → HMAC-SHA256 certificate signed and stored
12. **Blockchain** → SHA-256 hash saved to Bitcoin via OriginStamp

---

## 🧪 The 9 Fairness Dimensions

| # | Dimension | Threshold | What It Checks |
|---|---|---|---|
| 1 | **Demographic Parity** | < 10% disparity | Equal outcome rates across gender, race, age |
| 2 | **Equal Opportunity** | < 10% TPR gap | Equal true positive rates across all groups |
| 3 | **Calibration** | < 10% error gap | Confidence scores match actual outcomes |
| 4 | **Individual Fairness** | < 5% inconsistency | Similar people get similar outcomes |
| 5 | **Counterfactual Fairness** | < 10% flip rate | Outcome unchanged if only demographics change |
| 6 | **Transparency** | > 60% top-3 SHAP | Model decisions are explainable |
| 7 | **Privacy** | < 30% PII score | No PII columns or data leakage |
| 8 | **Robustness** | < 40% issues | Stable under noise, outliers, class imbalance |
| 9 | **Accountability** | > 70% complete | Audit trail, hash, blockchain present |

**Risk Levels:**

| Score | Risk |
|---|---|
| 0 – 39 | 🔴 Critical Risk |
| 40 – 59 | 🟠 High Risk |
| 60 – 79 | 🟡 Medium Risk |
| 80 – 100 | 🟢 Low Risk |

---

## 🛠️ Bias Mitigation Techniques

| Dimension | Technique | Library |
|---|---|---|
| Demographic Parity | Reweighing + Fairness Constraints | Fairlearn ExponentiatedGradient |
| Equal Opportunity | Threshold Adjustment | Fairlearn ThresholdOptimizer |
| Calibration | Platt Scaling per group | scikit-learn CalibratedClassifierCV |
| Individual Fairness | Fairness Regularization | Custom metric learning |
| Counterfactual Fairness | Causal Analysis + proxy removal | Custom causal graph |
| Privacy | PII Removal + Anonymization | Custom PII detector |
| Robustness | Data Augmentation + Noise Testing | Custom perturbation |

---

## 📋 Regulatory Compliance — 14 Checks

| Framework | Articles / Sections | Checks |
|---|---|---|
| **EU AI Act 2026** | Articles 9, 10, 13, 14, 15 | 5 checks |
| **India DPDP Act** | Sections 4, 6, 11, 16 | 4 checks |
| **ISO/IEC 42001** | Clauses 6.1.2, 8.4, 8.6, 9.1, 9.3 | 5 checks |

---

## 📱 All Pages

| Page | URL | Features |
|---|---|---|
| Homepage | `/` | Live animated bias preview, statistics |
| Upload | `/upload` | CSV upload, model type, progress bar |
| Results | `/results/:id` | 7 tabs — all analysis |
| History | `/history` | Continuous monitoring, drift detection |
| Compare | `/compare` | Multi-model comparison, CI/CD pipeline |
| Regression | `/regression` | Baseline vs improved model testing |

### Results Page — 7 Tabs

| Tab | What It Shows |
|---|---|
| 📊 Overview | Score ring, radar chart, AI summary, dimension counts |
| ⚖️ Fairness | All 9 dimensions with pass/fail, thresholds |
| 🧠 Explainability | SHAP, LIME, IF-THEN rules, counterfactuals |
| 📋 Compliance | 14 regulatory checks, digital signature |
| 🔧 Remediation | Per-dimension fixes, automated debiasing |
| 👥 Reports | Executive, Developer, Regulator, End-User views |
| 📈 Before/After | Current vs projected scores with improvement bars |

---

## 🗂️ Demo Datasets

| File | Domain | Sensitive Attributes | Rows | Expected Score |
|---|---|---|---|---|
| `adult_income.csv` | Income / Employment | sex, race, age | 1,000 | ~33 Critical |
| `german_credit.csv` | Credit Scoring | sex, age | 1,000 | ~28 Critical |
| `compas_recidivism.csv` | Criminal Justice | race, sex | 1,000 | ~30 Critical |
| `healthcare_diagnosis.csv` | Healthcare | age, gender, ethnicity | 1,000 | ~30 Critical |
| `fair_hiring.csv` | Hiring (synthetic fair) | gender, race | 1,000 | ~72 Medium |

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone
```bash
git clone https://github.com/Shubham2025-ai/jccs-ai-ethics.git
cd jccs-ai-ethics
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

> **Note:** Backend on Render free tier takes ~50 seconds to wake. Visit `/health` first before demo.

---

## 🔑 Environment Variables

```env
DATABASE_URL=sqlite:///./jccs.db
GROQ_API_KEY=your_groq_api_key
ORIGINSTAMP_API_KEY=your_originstamp_key
SECRET_KEY=your_random_secret_key
```

---

## 📦 Key Dependencies

**Backend:** `fastapi` `uvicorn` `sqlalchemy` `pandas` `scikit-learn` `fairlearn` `aif360` `shap` `lime` `groq>=0.11.0` `reportlab`

**Frontend:** `react@18` `vite` `tailwindcss` `lucide-react` `recharts` `react-router-dom`

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check / wake backend |
| `/audit/upload` | POST | Upload CSV, trigger full audit pipeline |
| `/audit/{id}` | GET | Fetch complete audit results |
| `/audits/list` | GET | List all past audits |
| `/audit/{id}/verify` | GET | Verify blockchain certificate |
| `/audit/{id}/verify-signature` | POST | Verify digital signature |
| `/audit/{id}/debias` | POST | Automated debiasing simulation |
| `/audit/monitor/trend` | GET | Continuous monitoring trend data |
| `/api/audit/batch` | POST | Upload 2–10 CSVs, run all in parallel |
| `/api/audit/batch/{id}` | GET | Poll batch progress |
| `/api/audit/compare` | GET | Compare multiple audits side-by-side |
| `/api/audit/autorun` | GET | Automated pipeline trigger |
| `/api/audit/regression-test` | POST | Upload baseline + improved model |
| `/api/audit/regression-test/{id}` | GET | Get regression test results |

---

## 🧪 Testing Evidence

Different results per dataset proves real analysis — not hardcoded:

| Test | adult_income | german_credit | compas | healthcare | fair_hiring |
|---|---|---|---|---|---|
| Overall Score | 33 | 28 | 30 | 30 | 72 |
| EU AI Act Art.10 | ❌ | ❌ | ❌ | ❌ | ❌ |
| EU AI Act Art.13 | ✅ | ✅ | ✅ | ✅ | ✅ |
| ISO 9.1 | ✅ | ❌ | ✅ | ✅ | ✅ |
| Privacy | ✅ | ✅ | ✅ | ✅ | ✅ |
| Robustness | ✅ | ✅ | ✅ | ✅ | ✅ |
| SHAP Generated | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rules Extracted | ✅ | ✅ | ✅ | ✅ | ✅ |
| Digital Signature | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📁 Project Structure

```
jccs-ai-ethics/
├── backend/app/
│   ├── main.py                         ← FastAPI app + CORS
│   ├── api/audit.py                    ← 14 audit endpoints
│   ├── routers/batch_audit.py          ← Batch + regression testing
│   ├── models/models.py                ← SQLAlchemy ORM
│   └── services/
│       ├── bias_engine.py              ← 9 dimensions + rule extraction
│       ├── audit_service.py            ← Full pipeline orchestration
│       ├── groq_service.py             ← LLaMA 3 AI summaries
│       └── blockchain_service.py       ← SHA-256 + Digital Signatures
├── frontend/src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── ResultsPage.jsx             ← 7 tabs
│   │   ├── HistoryPage.jsx             ← Monitoring dashboard
│   │   ├── ComparePage.jsx             ← CI/CD pipeline
│   │   └── RegressionPage.jsx          ← Regression testing
│   └── components/dashboard/Navbar.jsx
├── datasets/
│   ├── adult_income.csv
│   ├── german_credit.csv
│   ├── compas_recidivism.csv
│   ├── healthcare_diagnosis.csv
│   └── fair_hiring.csv
└── README.md
```

---

## 👥 Team

| | |
|---|---|
| **Team Name** | JCCS |
| **Problem Statement** | PS9 — Jedi Code Compliance System |
| **Hackathon** | Bluebit Hackathon 4.0 by MLSC PCCOE |
| **Round** | Round 3 Finalist — Offline at PCCOE |
| **Track** | Ethical AI |

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built with ⚡ during Bluebit Hackathon 4.0*

> *"Other tools are libraries for data scientists. JCCS is a compliance platform for business leaders — upload a CSV, get a court-ready audit report in 60 seconds."*

🌐 [jccs-ai-ethics.vercel.app](https://jccs-ai-ethics.vercel.app) — *May the Force — and fair AI — be with you. ⚔️*