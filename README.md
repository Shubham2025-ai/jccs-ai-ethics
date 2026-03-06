# 🛡 JCCS — Jedi Code Compliance System
### AI Ethics Auditing Platform | Star Wars Hackathon 2026 | PS9

> **"The Crash-Test Dummy for AI Systems"**
> Upload any AI model's predictions → Get a certified ethics scorecard in under 60 seconds → No coding required.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🚀 **Frontend** | https://jccs-ai-ethics.vercel.app |
| ⚙️ **Backend API** | https://jccs-ai-ethics.onrender.com |
| 📖 **API Docs** | https://jccs-ai-ethics.onrender.com/docs |
| 💻 **GitHub** | https://github.com/Shubham2025-ai/jccs-ai-ethics |

> ⚠️ Backend runs on Render free tier — first request may take 50 seconds to wake up. Visit `/health` first before demo.

---

## 🏆 Problem Statement
**PS9 — Ethical Score & Explainability Framework for AI Applications**

70% of AI systems carry hidden bias (MIT study). Hiring algorithms reject qualified candidates. Loan AIs discriminate by zip code. COMPAS recidivism scores flagged Black defendants 2× unfairly. Apple Card gave men 20× higher credit limits. **No standard tool exists to catch this before deployment — until now.**

---

## ✅ PS9 Success Criteria — 100% Covered

| Criteria | Required | JCCS | Implementation |
|---|---|---|---|
| Test AI across ethical dimensions | 5+ | ✅ **6** | Fairlearn + AIF360 |
| SHAP explainability | ✅ | ✅ Done | TreeExplainer — global feature importance |
| LIME explainability | ✅ | ✅ Done | Perturbation-based — individual decisions |
| Automated bias detection | ✅ | ✅ Done | 6 fairness algorithms in parallel |
| Remediation suggestions | ✅ | ✅ Done | AI-generated action plan per dimension |
| Compliance certification | ✅ | ✅ Done | EU AI Act + India DPDP + ISO 42001 |

---

## 🎯 Key Features

**Universal CSV Support** — Works with any domain: hiring, loans, healthcare, criminal justice, education — no configuration needed. Auto-detects label, prediction, and sensitive attribute columns.

**6 Fairness Dimensions** — Demographic Parity, Equal Opportunity, Calibration, Individual Fairness, Counterfactual Fairness, Model Transparency

**Dual Explainability** — SHAP (global — which features matter most overall) + LIME (local — why was THIS specific person rejected)

**AI Plain-Language Explanations** — Groq/Llama 3 converts complex bias metrics into plain English for executives and regulators

**Regulatory Compliance Mapping** — EU AI Act 2026 (Articles 10, 13, 14, 15) · India DPDP Act (Sections 4, 11, 16) · ISO/IEC 42001 (Clauses 6.1.2, 8.4, 9.1)

**Blockchain Audit Trail** — SHA-256 cryptographic proof + optional OriginStamp Bitcoin anchoring. Tamper-proof and verifiable.

**One-Click PDF Export** — Full compliance certificate ready for regulators

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS + Recharts |
| Backend | FastAPI (Python 3.11) |
| Bias Analysis | Microsoft Fairlearn + IBM AI Fairness 360 |
| Explainability | SHAP (TreeExplainer) + LIME (Perturbation-based) |
| AI Narratives | Groq API (Llama 3 — Free Tier) |
| Database | PostgreSQL (Render) |
| Blockchain | SHA-256 Cryptographic Proof + OriginStamp (Bitcoin) |
| Deployment | Render (Backend) + Vercel (Frontend) |

---

## 📂 Real-World Demo Datasets

| Dataset | Domain | Bias Pattern |
|---|---|---|
| `compas_recidivism.csv` | Criminal Justice | Black defendants flagged 2× more (ProPublica 2016) |
| `german_credit.csv` | Finance | Women + foreigners denied credit at higher rates |
| `adult_income.csv` | Employment | Women predicted lower income (UCI Census) |
| `healthcare_diagnosis.csv` | Healthcare | Women's pain undertreated, minorities misdiagnosed |
| `hiring_bias_demo.csv` | Hiring | Gender + age bias in candidate selection |

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL or SQLite (auto-fallback)

### 1. Clone
```bash
git clone https://github.com/Shubham2025-ai/jccs-ai-ethics.git
cd jccs-ai-ethics
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

### 3. Configure `.env`
```env
# Option A: PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/jccs_db

# Option B: SQLite (no setup needed)
USE_SQLITE=true

GROQ_API_KEY=gsk_your_groq_key_here
FRONTEND_URL=http://localhost:3000
```
Get free Groq key at: https://console.groq.com

### 4. Start Backend
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 🎉

---

## 📊 Quick Demo

1. Go to https://jccs-ai-ethics.vercel.app
2. Click **New Audit**
3. Upload `compas_recidivism.csv`
4. Watch 6 fairness dimensions run in real time
5. Explore all 5 tabs — Overview, Fairness, Explainability, Compliance, Remediation
6. Export PDF compliance certificate
7. Check blockchain certificate in Compliance tab

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/audit/upload` | Upload CSV, start audit |
| GET | `/audit/{id}` | Get full results |
| GET | `/audit/{id}/verify` | Verify blockchain certificate |
| GET | `/audits/list` | List all audits |
| GET | `/health` | Health check + DB status |
| GET | `/docs` | Swagger API docs |

---

## 🎯 SDG Alignment

| SDG | Connection |
|---|---|
| **SDG 16** — Peace, Justice & Strong Institutions | Blockchain audit trail enforces AI accountability |
| **SDG 8** — Decent Work & Economic Growth | Detects hiring bias, protects fair employment |
| **SDG 9** — Industry, Innovation & Infrastructure | Provides missing safety infrastructure for AI deployment |
| **SDG 10** — Reduced Inequalities | Catches racial, gender, age discrimination in AI systems |

---

## 🧠 How JCCS Works Internally

```
CSV Upload
    ↓
Auto Column Detection (two-pass strong/weak keyword matching)
    ↓
6 Fairness Dimensions (parallel)
├── Demographic Parity        → Microsoft Fairlearn
├── Equal Opportunity         → Microsoft Fairlearn
├── Calibration               → IBM AIF360
├── Individual Fairness       → Cosine similarity
├── Counterfactual Fairness   → Group prediction flip rate
└── Model Transparency        → SHAP TreeExplainer
    ↓
Explainability
├── SHAP  → Global feature importance
└── LIME  → Local perturbation analysis (custom implementation ~80 lines)
    ↓
AI Summary → Groq API (Llama 3)
    ↓
Compliance Mapping → EU AI Act · DPDP · ISO 42001
    ↓
Blockchain Anchoring → SHA-256 + OriginStamp
    ↓
PDF Certificate Export
```

---

*Star Wars Hackathon 2026 · PS9 · Built for responsible AI* 🛡