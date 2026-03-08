# 🛡️ JCCS — Jedi Code Compliance System



**Ethical AI Auditing Framework — Bluebit Hackathon 4.0 | PS9**

> *"The Force will be with you, always — but your AI model? That needs an audit."*

🌐 **Live Demo:** [jccs-ai-ethics.vercel.app](https://jccs-ai-ethics.vercel.app) &nbsp;|&nbsp; 🔗 **Backend API:** [jccs-ai-ethics.onrender.com](https://jccs-ai-ethics.onrender.com/health)

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
| Show WHY model made decisions | ✅ | Per-prediction feature attribution |
| Feature Importance Visualization | ✅ | Interactive SHAP bar + LIME charts |
| Visual Scorecard (Pass / Fail) | ✅ | Per-criterion compliance cards |
| Bias Instances Highlighted | ✅ | Top-3 most discriminatory features flagged |
| Recommendations for Improvement | ✅ | Domain-specific remediation per violation |

### Bonus Points — Both Achieved

| Bonus | Status |
|---|---|
| Test multiple AI models simultaneously | ✅ 4 datasets audited independently |
| Automated testing pipeline | ✅ Upload → auto-detect → audit → report |

### Beyond the Spec

- **Blockchain Anchoring** — SHA-256 hash anchored to Bitcoin via OriginStamp
- **Groq AI (LLaMA 3)** — Plain-English explanations of every bias finding
- **3 Regulatory Frameworks** — EU AI Act, India DPDP Act, ISO/IEC 42001
- **PDF Certificate** — Downloadable court-ready audit report
- **Counterfactual Fairness** — Would outcome change if only demographics changed?
- **Individual Fairness** — Similar people must receive similar outcomes

---

## 🎬 Demo Video

▶️ **[Watch 4-Minute Demo](#)** *(replace with YouTube/Drive link)*

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
│  └── HistoryPage — Audit trail + blockchain proof    │
├─────────────────────────────────────────────────────┤
│  Backend  FastAPI + Python 3.10                      │
│  ├── bias_engine.py      — 6 fairness dimensions     │
│  ├── audit_service.py    — SHAP + LIME pipeline      │
│  ├── groq_service.py     — AI summaries (LLaMA 3)   │
│  └── blockchain_service.py — SHA-256 + OriginStamp  │
├─────────────────────────────────────────────────────┤
│  Database  PostgreSQL (prod) / SQLite (local)        │
│  ML        Fairlearn · AIF360 · SHAP · LIME          │
│  AI        Groq API (LLaMA 3 70B)                    │
│  Chain     OriginStamp → Bitcoin blockchain          │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 The 6 Fairness Dimensions

| # | Dimension | What It Checks |
|---|---|---|
| 1 | **Demographic Parity** | Equal prediction rates across gender, race, age |
| 2 | **Equal Opportunity** | Equal true positive rates across all groups |
| 3 | **Calibration** | Confidence scores must match actual outcomes |
| 4 | **Individual Fairness** | Similar people must receive similar outcomes |
| 5 | **Counterfactual Fairness** | Would outcome change if only demographics were different? |
| 6 | **Transparency** | Model explainability coverage via SHAP + LIME |

**Risk Levels:**

| Score | Risk |
|---|---|
| 0 – 39 | 🔴 Critical Risk |
| 40 – 59 | 🟠 High Risk |
| 60 – 79 | 🟡 Medium Risk |
| 80 – 100 | 🟢 Low Risk |

---

## 📋 Regulatory Compliance Mapping

| Framework | Articles / Sections | Region | Enforcement |
|---|---|---|---|
| **EU AI Act 2026** | Articles 10, 13, 14, 15 | Europe | In force 2026 |
| **India DPDP Act** | Sections 4, 11, 16 | India | Active 2025–26 |
| **ISO/IEC 42001** | Clauses 6.1.2, 8.4, 9.1 | Global | International std |

---

## 🗂️ Demo Datasets

| File | Domain | Sensitive Attributes | Rows |
|---|---|---|---|
| `adult_income.csv` | Income / Employment | sex, race | 1,000 |
| `german_credit.csv` | Credit Scoring | sex, age | 1,000 |
| `compas_recidivism.csv` | Criminal Justice | race, sex | 1,000 |
| `healthcare_diagnosis.csv` | Healthcare | age, gender, ethnicity | 1,000 |

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

> **Note:** Backend on Render free tier takes ~50 seconds to wake. Visit `/health` first.

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

## 🧪 Testing Evidence

Different results per dataset proves real analysis (not hardcoded):

| Test | adult_income | german_credit | compas | healthcare |
|---|---|---|---|---|
| Overall Score | 33 | 28 | 32 | 30 |
| EU AI Act Art.14 | ✅ Pass | ❌ Fail | ✅ Pass | ✅ Pass |
| DPDP Section 16 | ❌ Fail | ❌ Fail | ❌ Fail | ✅ Pass |
| ISO 9.1 Calibration | ✅ Pass | ❌ Fail | ✅ Pass | ✅ Pass |
| SHAP Generated | ✅ | ✅ | ✅ | ✅ |
| LIME Generated | ✅ | ✅ | ✅ | ✅ |
| Blockchain Anchored | ✅ | ✅ | ✅ | ✅ |
| PDF Exported | ✅ | ✅ | ✅ | ✅ |

---

## 🔗 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check / wake backend |
| `/api/audit/upload` | POST | Upload CSV, trigger audit |
| `/api/audit/{id}` | GET | Fetch audit results |
| `/api/audit/history` | GET | List all past audits |
| `/api/audit/{id}/pdf` | GET | Download PDF report |

---

## 📁 Project Structure

```
jccs-ai-ethics/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routers/audit.py
│   │   └── services/
│   │       ├── audit_service.py
│   │       ├── bias_engine.py
│   │       ├── groq_service.py
│   │       └── blockchain_service.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── pages/
│   │       ├── HomePage.jsx
│   │       ├── UploadPage.jsx
│   │       ├── ResultsPage.jsx
│   │       └── HistoryPage.jsx
│   └── package.json
├── datasets/
│   ├── adult_income.csv
│   ├── german_credit.csv
│   ├── compas_recidivism.csv
│   └── healthcare_diagnosis.csv
└── README.md
```

---

## 👥 Team

| | |
|---|---|
| **Team Name** | JCCS |
| **Problem Statement** | PS9 — Jedi Code Compliance System |
| **Hackathon** | Bluebit Hackathon 4.0 by MLSC PCCOE |
| **Track** | Ethical AI |

---

## 📄 License

MIT — see [LICENSE](LICENSE)

---

*Built with ⚡ during Bluebit Hackathon 4.0*

> *"Other tools are libraries for data scientists. JCCS is a compliance platform for business leaders — upload a CSV, get a court-ready audit report in 60 seconds."*

🌐 [jccs-ai-ethics.vercel.app](https://jccs-ai-ethics.vercel.app) — *May the Force — and fair AI — be with you. ⚔️*