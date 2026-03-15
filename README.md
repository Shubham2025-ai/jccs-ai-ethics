# 🛡️ JCCS — Jedi Code Compliance System

**Ethical AI Auditing Framework — Bluebit Hackathon 4.0 | PS9 | Round 3 Finalist**

> *"The Force will be with you, always — but your AI model? That needs an audit."*

🌐 **Live Demo:** [jccs-ai-ethics.vercel.app](https://jccs-ai-ethics.vercel.app) &nbsp;|&nbsp; 🔗 **Backend API:** [jccs-ai-ethics.onrender.com](https://jccs-ai-ethics.onrender.com/health) &nbsp;|&nbsp; 🎬 **Demo Video:** [youtu.be/-OjU0iuaYBY](https://youtu.be/-OjU0iuaYBY)

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
| Privacy Preservation | ✅ | PII anonymization, no raw data stored |
| Transparency / Interpretability | ✅ | SHAP (global) + LIME (local) XAI |
| Show WHY model made specific decisions | ✅ | Per-prediction LIME feature attribution |
| Feature Importance Visualization | ✅ | Interactive SHAP bar + LIME charts |
| Visual Scorecard (Pass / Fail) | ✅ | Per-criterion compliance cards with thresholds |
| Bias Instances Highlighted | ✅ | Top-3 most discriminatory features flagged |
| Recommendations for Improvement | ✅ | Domain-specific remediation per violation |

### Bonus Points — Both Achieved ⭐⭐

| Bonus | Status | How |
|---|---|---|
| Test multiple AI models simultaneously | ✅ | Upload 2–10 CSVs → all audited in parallel threads simultaneously |
| Automated testing pipeline | ✅ | One click → auto-fetches 4 datasets → audits in parallel → CI/CD pipeline report with PASS/FAIL deployment gates |

### Beyond the Spec

- **Blockchain Anchoring** — SHA-256 hash anchored to Bitcoin via OriginStamp
- **LLaMA 3 70B via Groq** — Plain-English explanations of every bias finding
- **3 Regulatory Frameworks** — EU AI Act 2026, India DPDP Act, ISO/IEC 42001
- **PDF Certificate** — Downloadable court-ready audit report
- **Counterfactual Fairness** — Would outcome change if only demographics changed?
- **Individual Fairness** — Similar people must receive similar outcomes
- **Multi-Model Comparison** — Side-by-side fairness scores, dimension bars, compliance matrix
- **CI/CD Pipeline Report** — BLOCKED/APPROVED deployment gates per model
- **Model Type Support** — Classification, Regression, Ranking each use different ML model and scoring weights
- **Proxy Model Metrics** — Accuracy, Precision, Recall, F1, AUC-ROC via 80/20 train-test split
- **Lighthouse Scores** — Performance 92, Accessibility 96, Best Practices 100, SEO 91

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                JCCS Full Stack                       │
├─────────────────────────────────────────────────────┤
│  Frontend  React 18 + Vite + TailwindCSS             │
│  ├── HomePage    — Live bias preview card            │
│  ├── UploadPage  — CSV upload + progress bar         │
│  ├── ResultsPage — Score ring, SHAP/LIME, compliance │
│  ├── HistoryPage — Audit trail + blockchain proof    │
│  └── ComparePage — Multi-model comparison (BONUS)   │
├─────────────────────────────────────────────────────┤
│  Backend  FastAPI + Python 3.11                      │
│  ├── bias_engine.py      — 6 fairness dimensions     │
│  ├── audit_service.py    — SHAP + LIME pipeline      │
│  ├── groq_service.py     — AI summaries (LLaMA 3)   │
│  ├── batch_audit.py      — Parallel multi-model audit│
│  └── blockchain_service.py — SHA-256 + OriginStamp  │
├─────────────────────────────────────────────────────┤
│  Database  PostgreSQL (prod) / SQLite (local)        │
│  ML        Fairlearn · AIF360 · SHAP · LIME          │
│  AI        Groq API (LLaMA 3 70B)                    │
│  Chain     OriginStamp → Bitcoin blockchain          │
└─────────────────────────────────────────────────────┘
```

---

## 🤖 How the ML Model Works

1. **Upload CSV** → FastAPI receives file, creates audit record
2. **Column Detection** → `bias_engine.detect_columns()` auto-identifies sensitive attributes, outcome column, and domain
3. **Proxy Model Training** → `RandomForestClassifier` (classification/ranking) or `RandomForestRegressor` (regression) trained on 80% of uploaded data
4. **6 Fairness Dimensions** → Fairlearn + AIF360 compute disparity metrics per group
5. **SHAP Analysis** → `TreeExplainer` on proxy model → global feature importance
6. **LIME Analysis** → Perturbation-based → individual decision explanation
7. **Score Calculation** → Weighted average of 6 dimensions (weights differ by model type)
8. **AI Summary** → LLaMA 3 70B generates plain-English findings and remediation plan
9. **Compliance Mapping** → Results mapped to EU AI Act, DPDP, ISO article numbers
10. **Blockchain** → SHA-256 hash saved to Bitcoin via OriginStamp

---

## 🧪 The 6 Fairness Dimensions

| # | Dimension | Threshold | What It Checks |
|---|---|---|---|
| 1 | **Demographic Parity** | < 10% disparity | Equal prediction rates across gender, race, age |
| 2 | **Equal Opportunity** | < 10% TPR gap | Equal true positive rates across all groups |
| 3 | **Calibration** | < 10% error gap | Confidence scores must match actual outcomes |
| 4 | **Individual Fairness** | < 5% inconsistency | Similar people must receive similar outcomes |
| 5 | **Counterfactual Fairness** | < 10% flip rate | Outcome unchanged if only demographics change |
| 6 | **Transparency** | > 60% top-3 coverage | Model explainability via SHAP + LIME |

**Risk Levels:**

| Score | Risk |
|---|---|
| 0 – 39 | 🔴 Critical Risk |
| 40 – 59 | 🟠 High Risk |
| 60 – 79 | 🟡 Medium Risk |
| 80 – 100 | 🟢 Low Risk |

---

## 🛠️ Bias Mitigation Techniques

Each failed dimension receives a specific mitigation recommendation:

| Dimension | Technique | Library |
|---|---|---|
| Demographic Parity | Reweighing + Fairness Constraints | Fairlearn ExponentiatedGradient |
| Equal Opportunity | Threshold Adjustment | Fairlearn ThresholdOptimizer |
| Calibration | Platt Scaling per group | scikit-learn CalibratedClassifierCV |
| Individual Fairness | Fairness Regularization | Custom metric learning |
| Counterfactual Fairness | Causal Analysis + proxy removal | Custom causal graph |

---

## 📋 Regulatory Compliance Mapping

| Framework | Articles / Sections | Region | Enforcement |
|---|---|---|---|
| **EU AI Act 2026** | Articles 10, 13, 14, 15 | Europe | In force 2026 |
| **India DPDP Act** | Sections 4, 11, 16 | India | Active 2025–26 |
| **ISO/IEC 42001** | Clauses 6.1.2, 8.4, 9.1 | Global | International std |

---

## 🗂️ Demo Datasets

| File | Domain | Sensitive Attributes | Rows | Expected Score |
|---|---|---|---|---|
| `adult_income.csv` | Income / Employment | sex, race, age | 1,000 | ~33 Critical |
| `german_credit.csv` | Credit Scoring | sex, age | 1,000 | ~28 Critical |
| `compas_recidivism.csv` | Criminal Justice | race, sex | 1,000 | ~30 Critical |
| `healthcare_diagnosis.csv` | Healthcare | age, gender, ethnicity | 1,000 | ~30 Critical |
| `fair_hiring.csv` | Hiring (synthetic) | gender, race | 1,000 | ~68 Medium |

---

## 🧪 Testing Evidence

Different results per dataset proves real analysis — not hardcoded:

| Test | adult_income | german_credit | compas | healthcare |
|---|---|---|---|---|
| Overall Score | 33 | 28 | 30 | 30 |
| EU AI Act Art.14 | ✅ Pass | ❌ Fail | ✅ Pass | ✅ Pass |
| DPDP Section 16 | ❌ Fail | ❌ Fail | ❌ Fail | ✅ Pass |
| ISO 9.1 Calibration | ✅ Pass | ❌ Fail | ✅ Pass | ✅ Pass |
| SHAP Generated | ✅ | ✅ | ✅ | ✅ |
| LIME Generated | ✅ | ✅ | ✅ | ✅ |
| Blockchain Anchored | ✅ | ✅ | ✅ | ✅ |
| PDF Exported | ✅ | ✅ | ✅ | ✅ |

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

Create `backend/.env`:

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
| `/api/audit/batch` | POST | Upload 2–10 CSVs, run all in parallel |
| `/api/audit/batch/{id}` | GET | Poll batch progress |
| `/api/audit/compare` | GET | Compare multiple audits side-by-side |
| `/api/audit/autorun` | GET | Automated pipeline trigger |

---

## 📁 Project Structure

```
jccs-ai-ethics/
├── backend/
│   ├── app/
│   │   ├── main.py                        ← FastAPI app + CORS
│   │   ├── api/audit.py                   ← Main audit endpoints
│   │   ├── routers/batch_audit.py         ← BONUS: parallel multi-model
│   │   ├── models/models.py               ← SQLAlchemy ORM
│   │   └── services/
│   │       ├── bias_engine.py             ← 6 fairness dimensions + SHAP/LIME
│   │       ├── audit_service.py           ← Orchestration pipeline
│   │       ├── groq_service.py            ← LLaMA 3 AI summaries
│   │       └── blockchain_service.py      ← SHA-256 + OriginStamp
│   └── requirements.txt
├── frontend/src/
│   ├── pages/
│   │   ├── HomePage.jsx                   ← Live bias preview
│   │   ├── UploadPage.jsx                 ← CSV upload + progress
│   │   ├── ResultsPage.jsx                ← Full audit results
│   │   ├── HistoryPage.jsx                ← Audit history
│   │   └── ComparePage.jsx                ← BONUS: multi-model comparison
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
| **Team Name** | print("WIN") |
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