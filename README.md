🌐 Live Demo: https://jccs-ai-ethics.vercel.app
# JCCS — Jedi Code Compliance System
## Complete Setup Guide (Windows)

---

## 📁 Project Structure

```
jccs/
├── backend/                  ← FastAPI + Python
│   ├── app/
│   │   ├── main.py           ← Entry point
│   │   ├── core/
│   │   │   ├── config.py     ← Settings (.env reader)
│   │   │   └── database.py   ← MySQL connection
│   │   ├── models/
│   │   │   └── models.py     ← Database tables
│   │   ├── services/
│   │   │   ├── bias_engine.py   ← 6 fairness dimensions + SHAP
│   │   │   ├── claude_service.py← Claude AI explanations
│   │   │   └── audit_service.py ← Orchestrates everything
│   │   └── api/
│   │       └── audit.py      ← REST API endpoints
│   ├── requirements.txt
│   └── .env                  ← YOUR CREDENTIALS GO HERE
│
├── frontend/                 ← React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── UploadPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/
│   │   │   └── dashboard/Navbar.jsx
│   │   └── utils/api.js
│   └── package.json
│
└── database/
    └── schema.sql            ← Run this in MySQL first
```

---

## 🚀 STEP 1 — Setup MySQL Database

Open MySQL Workbench or Command Prompt:

```sql
-- Option A: MySQL Workbench
-- Open schema.sql and click Run (lightning bolt icon)

-- Option B: Command Prompt
mysql -u root -p
-- Enter your password, then:
source C:\path\to\jccs\database\schema.sql
```

---

## 🐍 STEP 2 — Setup Backend

Open Command Prompt or PowerShell in the `backend/` folder:

```bash
# Create virtual environment
python -m venv venv

# Activate it (Windows CMD)
venv\Scripts\activate

# Activate it (PowerShell)
venv\Scripts\Activate.ps1

# Install all packages
pip install -r requirements.txt

# ⚠️ NOTE: Some packages (aif360, shap) take 3-5 minutes to install
```

### Edit your .env file:
Open `backend/.env` and fill in:
```
DB_PASSWORD=your_actual_mysql_password
GROQ_API_KEY=gsk_your_groq_key_here
```

Get your FREE Groq API key from: https://console.groq.com (no credit card needed)

### Start the backend:
```bash
# Make sure venv is active, then:
uvicorn app.main:app --reload --port 8000

# You should see:
# ✅ MySQL tables initialized
# ✅ MySQL connection successful
# 🚀 Uvicorn running on http://127.0.0.1:8000
```

### Test backend is working:
Open browser → http://localhost:8000
You should see: `{"app": "JCCS...", "status": "running"}`

API docs: http://localhost:8000/docs

---

## ⚛️ STEP 3 — Setup Frontend

Open a NEW Command Prompt in the `frontend/` folder:

```bash
# Install packages
npm install

# Start development server
npm run dev

# You should see:
# Local: http://localhost:3000
```

Open browser → http://localhost:3000 🎉

---

## 📊 STEP 4 — Test with Sample CSV

Create a file called `test_data.csv` with this content:

```csv
actual,predicted,gender,age,income,credit_score,loan_amount
1,1,Male,34,60000,720,50000
0,1,Female,28,45000,680,40000
1,0,Female,45,70000,740,60000
1,1,Male,52,80000,760,80000
0,0,Female,31,38000,650,30000
1,1,Male,29,55000,710,45000
0,1,Female,36,42000,665,35000
1,1,Male,48,90000,780,90000
1,0,Female,27,35000,630,25000
0,0,Male,55,65000,695,55000
1,1,Male,41,75000,750,70000
0,1,Female,24,30000,610,20000
```

1. Go to http://localhost:3000/upload
2. Drag `test_data.csv` onto the upload area
3. Name it "Loan Model Test"
4. Click "Run Bias Audit"
5. Wait ~15-30 seconds
6. See your full bias report! 🎉

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL connection failed | Check DB_PASSWORD in .env matches your MySQL password |
| `ModuleNotFoundError` | Make sure venv is activated before running uvicorn |
| Frontend can't reach backend | Make sure backend is running on port 8000 |
| SHAP install fails | Run `pip install shap --no-build-isolation` |
| aif360 install fails | Run `pip install aif360 --no-deps` then install deps manually |
| PowerShell Activate error | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |

---

## 🌐 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | /audit/upload | Upload CSV and start audit |
| GET | /audit/{id} | Get audit results |
| GET | /audits/list | List all audits |
| DELETE | /audit/{id} | Delete audit |
| GET | /health | Check server + DB status |
| GET | /docs | Swagger API documentation |

---

## 💡 How to Demo for Judges

1. Open http://localhost:3000 — show the clean dark UI
2. Upload test_data.csv — show the drag-drop
3. Wait for analysis — explain what's happening behind the scenes
4. Show Results → Overview tab (Ethics Scorecard ring)
5. Switch to Fairness tab — show each dimension's pass/fail
6. Switch to Explainability — SHAP bar chart
7. Switch to Compliance — EU AI Act, DPDP, ISO checkmarks
8. Switch to Remediation — AI-generated action plan
9. Point out SHA-256 hash — the blockchain audit trail

**Talking points:**
- "6 fairness dimensions analyzed in under 60 seconds"
- "No Python knowledge required — compliance officers can use this"
- "Claude AI converts complex SHAP values into plain English"
- "Immutable audit trail — results cannot be tampered with"
- "Maps directly to EU AI Act 2026 compliance requirements"
