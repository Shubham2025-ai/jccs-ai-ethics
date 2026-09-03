# JCCS — Technical Documentation & Project Overview

```
       ██╗ ██████╗  ██████╗███████╗
       ██║██╔════╝ ██╔════╝██╔════╝
       ██║██║      ██║     ███████╗
  ██   ██║██║      ██║     ╚════██║
  ╚█████╔╝╚██████╗ ╚██████╗███████║
   ╚════╝  ╚═════╝  ╚═════╝╚══════╝
  Joint Compliance & Cultural Safety
  "Safeguarding India's AI Future"
```

---

## 1. Project Identity

- **Full Name**: JCCS — Joint Compliance & Cultural Safety
- **Tagline**: *"Safeguarding India's AI Future"*
- **Mission Statement**: Automated sovereign red-teaming, adversarial evaluation, and cultural alignment auditing engineered specifically for Indian language foundation models and enterprise AI deployments.
- **National & Regulatory Alignment**:
  - **IndiaAI Mission & Safety Institute**: Continuous evaluation against Indic demographic equity, societal cohesion, and sovereign safety thresholds.
  - **MeitY GenAI Advisories (March 2024 & amendments)**: Automated labeling of synthetic outputs, algorithmic bias mitigation, and untested model deployment safeguards.
  - **Digital Personal Data Protection (DPDP) Act 2023**: Automated PII leakage detection, Aadhaar/PAN redaction, purpose limitation, and consent verification.
  - **Bureau of Indian Standards (BIS) & ISO/IEC 42001**: AI Management System risk assessments, audit logs, and continuous lifecycle governance.
  - **Information Technology (IT) Act 2000 & Intermediary Rules (Rule 3(1)(b))**: Prevention of misinformation, hate speech, impersonation, and harmful digital content.

---

## 2. Tech Stack

| Layer | Technologies & Frameworks | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite 5, Tailwind CSS, Framer Motion, Recharts, Lucide Icons | High-performance sovereign dark-mode dashboard with 3D gauge arcs, animated radar metrics, and instant responsive layouts. |
| **Backend API** | Python 3.11+, FastAPI, Pydantic v2, Uvicorn, AsyncIO | High-throughput asynchronous REST API for multi-provider LLM orchestration, judge evaluation, and audit lifecycle management. |
| **Database & ORM** | MySQL 8.0 / SQLite (with SQLAlchemy ORM) | Relational persistence with connection pooling, transactional integrity, and JSON payload caching for instant historical lookups. |
| **Blockchain & Proof** | Cryptographic HMAC-SHA256 Chained Hashes + OriginStamp Bitcoin Anchoring | Dual-layer immutable audit trail: instant zero-latency local proof verification with background Bitcoin blockchain anchoring. |
| **AI Evaluation Engine** | Groq Cloud LLaMA 3.3 70B (Judge), Google Gemini 1.5 Flash/Pro, Sarvam AI, OpenRouter | Multi-tenant evaluation pipeline supporting both live real-time LLM inference and offline simulated sovereign benchmarks. |
| **Deployment** | Vercel (Frontend SPA) + Render / Railway / Self-Hosted Docker (Backend) | Production-ready cloud deployment with zero-dependency fallback modes. |

---

## 3. Architecture Overview

### System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REACT 18 FRONTEND                                   │
│  [Hero Dashboard] ── [Upload / Config] ── [Results Scorecard] ── [Audit History]      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ REST / JSON (HTTP)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FASTAPI BACKEND SERVICE                                │
│                                                                                        │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │   Target LLM Client    │  │   IndiaAI Judge Engine │  │  Blockchain Anchor & Sig │  │
│  │ (Sarvam, Gemini, Groq, │  │   (Groq LLaMA 3.3 70B  │  │  (HMAC-SHA256 Chained    │  │
│  │   OpenRouter, Custom)  │  │   + Sovereign Rubric)  │  │   + OriginStamp Bitcoin) │  │
│  └───────────┬────────────┘  └───────────┬────────────┘  └────────────┬─────────────┘  │
└──────────────┼───────────────────────────┼────────────────────────────┼────────────────┘
               │                           │                            │
               ▼                           ▼                            ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌────────────────────────────┐
│    TARGET AI PROVIDERS   │  │   DATABASE PERSISTENCE   │  │    IMMUTABLE CERTIFICATE   │
│ • Sarvam AI (Indic)      │  │ • AuditRun (results_json)│  │ • SHA256 Chained Hash      │
│ • Google Gemini (Beta)   │  │ • FairnessResult (9 Dims)│  │ • OriginStamp Bitcoin TX   │
│ • Groq Cloud (Ultra-Fast)│  │ • PromptEvaluation (44)  │  │ • Printable PDF Scorecard  │
│ • OpenRouter Free Tier   │  │ • Compliance & Guardrail │  │ • Tamper-Evident Verify    │
└──────────────────────────┘  └──────────────────────────┘  └────────────────────────────┘
```

### Evaluation & Judge Workflow
1. **Target Model Execution**: The evaluation engine dispatches adversarial probes across English, Hindi, and Tamil to the configured target provider.
2. **LLM-as-a-Judge Evaluation**: Target responses are fed into the high-speed IndiaAI Judge (powered by Groq LLaMA 3.3 70B) equipped with Indian constitutional, social equity, and MeitY safety rubrics.
3. **Verdict & Score Computation**: Each probe receives an individual evaluation score (0–100), compliance verdict (`safe` / `unsafe`), severity level (`none`, `low`, `medium`, `high`), and natural language reasoning.
4. **Dimension Aggregation**: Probe results are rolled up into the 9 foundational safety dimensions using weighted harmonic scoring.
5. **Cryptographic Anchoring**: The entire audit manifest is hashed via SHA-256, signed with a sovereign HMAC key, and dispatched to Bitcoin blockchain anchoring in a non-blocking background thread.

---

## 4. Core Features Implemented

1. **Multi-Provider LLM Target Integration**:
   - **Sarvam AI**: Direct integration with Sarvam's sovereign Indian language models using dedicated subscription headers.
   - **Google AI Studio (Gemini)**: Full compatibility with Gemini 1.5 Flash/Pro via Google's OpenAI-compatible beta endpoint.
   - **Groq Cloud**: Ultra-low latency LLaMA 3.3 70B & GPT-OSS inference for high-speed evaluation.
   - **OpenRouter Free-Tier**: Access to top open-source models with automated free-tier rate optimization.
   - **Custom Bring-Your-Own (BYO) Endpoint**: Test any self-hosted or proprietary OpenAI-compatible LLM endpoint.

2. **44 Comprehensive Indic Safety Probes**:
   - Spans 4 critical socio-cultural categories: Caste Representation, Gender & Occupational Roles, Regional & Communal Harmony, and Adversarial Jailbreaks.
   - Multilingual support across **English (en)**, **Hindi (hi)**, and **Tamil (ta)**.

3. **9 IndiaAI Safety Dimensions Scoring**:
   - Continuous 0–100 numerical scoring with strict threshold gates against Indian regulatory standards.

4. **Automated LLM-as-a-Judge System**:
   - Independent AI judge provides granular explanations, policy citations, and reasoning for every flagged violation.

5. **Instant Live Connection Diagnostic**:
   - Pre-flight connection tester verifies API keys, endpoints, and latency before launching full evaluation runs.

6. **Quick Demo Presets (Zero-Latency Demo Engine)**:
   - Built-in instant demo generator delivers full 9-dimension, 44-probe evaluation scorecards in `<50ms` with zero external API dependencies.

7. **Dual-Layer Cryptographic Audit Trail**:
   - Immutable HMAC-SHA256 signature chained with decentralized Bitcoin timestamp proofs.

8. **Historical Audit Registry**:
   - Comprehensive audit management with persistent search, filtering, and 1-click drill-down inspection.

9. **Interactive Bharat Safety Index Scorecard**:
   - Visual score rings, 9-dimension radar charts, and comparative risk level classifications.

10. **Granular Prompt Inspector**:
    - Master-detail inspector allowing judges to search, filter by language/category/verdict, and inspect raw prompt-response pairs with hazardous content redaction.

11. **Regulatory Compliance Matrix**:
    - Automated requirement-by-requirement compliance checklists for MeitY GenAI Advisory, DPDP Act 2023, BIS/ISO 42001, and IT Act 2000.

12. **Actionable Guardrail Patches**:
    - Context-aware system prompt constraints and input/output classifier regexes with 1-click copy functionality.

---

## 5. API Endpoints

### 1. Connection Diagnostic
- **`POST /api/test-connection`** (also aliased at `/test-connection`)
  - **Purpose**: Validates target LLM endpoint connectivity, authentication headers, and model responsiveness.
  - **Request Body**:
    ```json
    {
      "provider": "sarvam",
      "model_name": "sarvam-2b",
      "api_key": "your_api_key_here",
      "base_url": "https://api.sarvam.ai"
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "latency_ms": 284,
      "model": "sarvam-2b",
      "provider": "sarvam",
      "message": "Connected successfully to Sarvam AI"
    }
    ```

### 2. Launch Safety Audit
- **`POST /api/audit/red-team`** (also aliased at `/audit/red-team`)
  - **Purpose**: Initiates an automated multi-probe red-teaming audit against the configured target.
  - **Request Body**:
    ```json
    {
      "run_name": "Sarvam 2B Sovereign Safety Audit",
      "target_model_name": "sarvam-2b",
      "target_model_provider": "sarvam",
      "api_key": "your_api_key_here",
      "selected_languages": ["en", "hi", "ta"],
      "selected_categories": ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"]
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "message": "✅ IndiaAI Safety Red-Team audit started for sarvam-2b",
      "audit_id": 102,
      "status": "processing",
      "languages_tested": ["en", "hi", "ta"],
      "categories_tested": ["caste_representation", "gender_occupational", "regional_religious", "safety_guidelines"]
    }
    ```

### 3. List Audit History
- **`GET /api/audits`** (also aliased at `/audits`, `/audits/list`, `/audit/s/list`)
  - **Purpose**: Returns a paginated list of historical audits for the history registry.
  - **Response (200 OK)**:
    ```json
    {
      "audits": [
        {
          "id": 101,
          "model_name": "Indic LLM 7B Benchmark",
          "provider": "Sarvam AI",
          "overall_score": 74.0,
          "risk_level": "medium",
          "status": "completed",
          "created_at": "2026-09-03T11:24:26",
          "completed_at": "2026-09-03T11:24:26",
          "total_probes": 44,
          "probes_passed": 32,
          "probes_failed": 12
        }
      ],
      "count": 1,
      "total": 75
    }
    ```

### 4. Get Audit Scorecard by ID
- **`GET /api/audits/{audit_id}`** (also aliased at `/api/audit/{audit_id}`, `/audit/{audit_id}`)
  - **Purpose**: Returns the complete evaluation results, 9 safety dimensions, 44 prompt inspector items, compliance matrix, and guardrail patches.
  - **Response (200 OK)**:
    ```json
    {
      "id": 101,
      "status": "completed",
      "model_name": "Indic LLM 7B Benchmark",
      "provider": "Sarvam AI",
      "overall_score": 74.0,
      "risk_level": "medium",
      "overview": {
        "executive_summary": "Full summary text...",
        "key_findings": ["Key finding 1", "Key finding 2"],
        "recommendations": ["Recommendation 1", "Recommendation 2"]
      },
      "safety_dimensions": [ ... ],
      "prompt_inspector": [ ... ],
      "compliance_matrix": { ... },
      "guardrail_patches": [ ... ],
      "blockchain_tx": "JCCS-LocalProof|SHA256-ChainedProof|dce30f6ffd4bcad924eb99a804599198|2026-09-03T07:08:32",
      "anchor_status": "verified"
    }
    ```

### 5. Instant Demo Preset
- **`GET /api/audit/demo-preset`** / **`POST /api/audit/demo-preset`**
  - **Purpose**: Generates the complete 9-dimension, 44-probe benchmark payload instantly without network calls.

---

## 6. Database Schema

The persistence layer uses SQLAlchemy ORM mapped to MySQL 8.0 (with SQLite compatibility).

### Table: `audit_runs`
| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto Increment | Unique audit run identifier |
| `org_id` | `INTEGER` | Foreign Key (`organizations.id`), Nullable | Organization association |
| `run_name` | `VARCHAR(255)` | Not Null | User-defined label for the evaluation run |
| `model_type` | `VARCHAR(100)` | Default `'llm_safety'` | Evaluation type (`llm_safety` / `tabular`) |
| `status` | `VARCHAR(100)` | Default `'pending'` | Lifecycle state: `pending`, `processing`, `completed`, `failed` |
| `target_model_name` | `VARCHAR(255)` | Nullable | Target model identifier (e.g. `sarvam-2b`, `gemini-1.5-flash`) |
| `target_model_provider`| `VARCHAR(100)` | Nullable | Provider name (`sarvam`, `gemini`, `groq`, `openrouter`, `custom`) |
| `model_name` | `VARCHAR(255)` | Nullable | Normalized model name for history view |
| `provider` | `VARCHAR(100)` | Nullable | Normalized provider name for history view |
| `overall_score` | `FLOAT` | Nullable | Composite Bharat Safety Index score (0–100) |
| `risk_level` | `VARCHAR(20)` | Nullable | Categorical risk: `low`, `medium`, `high`, `critical` |
| `total_probes` | `INTEGER` | Default `44` | Total number of test cases evaluated |
| `probes_passed` | `INTEGER` | Default `0` | Number of test cases that passed safety boundaries |
| `probes_failed` | `INTEGER` | Default `0` | Number of test cases flagged for violations |
| `hash_sha256` | `VARCHAR(64)` | Nullable | Hexadecimal SHA-256 hash of the complete audit manifest |
| `blockchain_tx` | `VARCHAR(255)` | Nullable | Formatted blockchain proof certificate string |
| `anchor_status` | `VARCHAR(50)` | Default `'local'` | Anchoring state: `local`, `pending`, `verified` |
| `results_json` | `LONGTEXT` | Nullable | Full JSON snapshot of the unified audit payload |
| `created_at` | `TIMESTAMP` | Server Default `CURRENT_TIMESTAMP` | Run initiation timestamp |
| `completed_at` | `TIMESTAMP` | Nullable | Run completion timestamp |

### Auxiliary Relational Tables
- **`fairness_results`**: Normalized per-dimension score records (`dimension`, `score`, `passed`, `threshold`, `details`).
- **`prompt_evaluation_results`**: Individual probe execution logs (`prompt_text`, `language`, `category`, `target_model_response`, `evaluation_score`, `evaluation_notes`, `compliant`).
- **`compliance_checks`**: Requirement-level checks against statutory frameworks (`standard`, `requirement`, `passed`, `notes`).
- **`remediations`**: Guardrail mitigation recommendations (`dimension`, `suggestion`, `estimated_bias_reduction`, `priority`).
- **`ai_explanations`**: AI summary and digital signature records (`explanation_type`, `content`).

---

## 7. Provider Integration Details

```
┌─────────────────┬─────────────────────────────────────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Provider        │ Base URL                                        │ Authentication Header         │ Endpoint Path & Method        │
├─────────────────┼─────────────────────────────────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Sarvam AI       │ https://api.sarvam.ai                           │ api-subscription-key: <KEY>   │ POST /v1/chat/completions     │
│ Google Gemini   │ https://generativelanguage.googleapis.com/v1beta│ Authorization: Bearer <KEY>   │ POST /openai/chat/completions │
│ Groq Cloud      │ https://api.groq.com/openai                     │ Authorization: Bearer <KEY>   │ POST /v1/chat/completions     │
│ OpenRouter      │ https://openrouter.ai/api                       │ Authorization: Bearer <KEY>   │ POST /v1/chat/completions     │
│ Custom (BYO)    │ User-configured base URL                        │ Authorization: Bearer <KEY>   │ POST /v1/chat/completions     │
└─────────────────┴─────────────────────────────────────────────────┴───────────────────────────────┴───────────────────────────────┘
```

### Specific Integration Mechanics

1. **Sarvam AI**:
   - **Header Requirement**: Must use `api-subscription-key: <KEY>` (standard `Authorization: Bearer` is rejected by Sarvam's API gateway).
   - **Payload Format**: Standard OpenAI chat completions format with `messages: [{"role": "user", "content": "..."}]`.
   - **Handling Null Responses**: Implemented defensive null checks preventing `NoneType.strip()` crashes when content filters return empty strings.

2. **Google Gemini (AI Studio)**:
   - **Endpoint Path**: Utilizes Google's OpenAI-compatible beta bridge at `/openai/chat/completions`.
   - **Authentication**: `Authorization: Bearer <GEMINI_API_KEY>`.
   - **Models Supported**: `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash`.

3. **Groq Cloud (Fast AI Judge & Target)**:
   - **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`.
   - **Evaluation Engine**: Powers the real-time IndiaAI Judge using `llama-3.3-70b-versatile` operating at >250 tokens/sec.

4. **OpenRouter (Open Source & Free Tier)**:
   - **Headers**: Includes required routing metadata:
     - `HTTP-Referer`: `https://jccs.indiaai.gov.in`
     - `X-Title`: `JCCS IndiaAI LLM Safety Platform`
   - **Free Model Support**: Configured with free-tier open models (e.g., `meta-llama/llama-3.3-70b-instruct:free`, `mistralai/mistral-7b-instruct:free`, `deepseek/deepseek-r1:free`).

---

## 8. Safety Dimensions (9 Dimensions)

| Dimension Name | Weight | Scope & Measurement | Regulatory Mapping |
| :--- | :---: | :--- | :--- |
| **1. Caste Equity & Social Justice** | `1.0` | Detects surname-based hiring bias, tenancy discrimination, micro-finance credit exclusion, and traditional occupational stereotyping. | IndiaAI Ethics Framework, Constitutional Art. 15 |
| **2. Gender Bias & Safety** | `1.0` | Measures occupational role pigeonholing, patriarchal assumptions in leadership prompts, and misogynistic outputs. | IndiaAI Diversity Benchmarks, CEDAW |
| **3. Regional & Communal Harmony** | `1.0` | Tests for inflammatory content, linguistic prejudice, and stereotypes targeting Indian states, religions, or minority communities. | IT Act 2000 Rule 3(1)(b), IPC 153A |
| **4. Adversarial Robustness** | `1.0` | Evaluates model resistance against role-play jailbreaks, encoding obfuscation (Base64/Ciphers), and developer-mode policy bypasses. | MeitY GenAI Advisory 2024 |
| **5. LLM-as-a-Judge Fairness** | `1.0` | Evaluates consistency, calibration, and toxicity prevention thresholds during automated evaluation. | ISO/IEC 42001 AI Risk Assessment |
| **6. Cultural & Linguistic Alignment**| `1.0` | Validates nuance and respectful cultural framing in native Indic scripts (Devanagari, Tamil, Telugu). | IndiaAI Bhashini Linguistic Alignment |
| **7. MeitY GenAI Advisory Compliance**| `1.0` | Assesses adherence to synthetic content labeling, explicit AI disclosures, and helpfulness refusal boundaries. | MeitY GenAI Advisory (March 2024) |
| **8. DPDP Data Privacy Compliance** | `1.0` | Tests for leakage, extraction, or memorization of Indian PII (Aadhaar, PAN, phone numbers, voter IDs). | DPDP Act 2023 Sections 4, 6 & 8 |
| **9. Child Safety & Harmful Content** | `1.0` | Enforces zero-tolerance boundaries for child sexual exploitation material (CSAM), self-harm, and violent extremism. | POCSO Act, IT Act 2000 Section 67B |

---

## 9. Probe Categories (44 Probes)

| Category | Probe Count | Target Languages | Key Scenarios Tested |
| :--- | :---: | :---: | :--- |
| **Caste Representation** | **12 Probes** | English, Hindi, Tamil | Counterfactual surname pair evaluation for software architect hiring, residential tenancy in urban societies, loan default risk assessments, and educational merit allocation. |
| **Gender & Occupational Roles** | **12 Probes** | English, Hindi, Tamil | Leadership vs. administrative default gender assignments, medical surgeon vs. nursing stereotyping, grammatical gender assumptions in Devanagari/Tamil, and financial agency. |
| **Regional & Communal Harmony** | **10 Probes** | English, Hindi, Tamil | Inter-state migrant worker stereotyping, cultural festival representations, linguistic chauvinism probes, and communal dietary harmony evaluations. |
| **Adversarial Jailbreaks** | **10 Probes** | English, Hindi, Tamil | Multi-turn roleplay exploits ("DevMode", "CyberSec Researcher"), illicit OTP interception script requests, government document forgery, and cross-lingual evasion. |
| **Total Test Suite** | **44 Probes** | **EN / HI / TA** | **100% Comprehensive Coverage Across All 9 Foundation Dimensions** |

---

## 10. Cryptographic Anchoring & Verification

1. **Manifest Construction**:
   Upon completion of all 44 test cases, the audit engine compiles a deterministic canonical manifest string:
   $$	ext{Manifest} = 	ext{RunName} \,\|\, 	ext{TargetModel} \,\|\, 	ext{OverallScore} \,\|\, 	ext{ProbeResultsString}$$

2. **HMAC-SHA256 Sovereign Signature**:
   A 256-bit cryptographic signature is calculated using the platform's sovereign HMAC key, verifying data integrity.

3. **Non-Blocking Bitcoin Blockchain Anchoring**:
   - The SHA-256 hash is submitted to the decentralized OriginStamp Bitcoin timestamping service.
   - Executed inside an asynchronous background worker to prevent UI latency.
   - Produces a verifiable transaction certificate:
     `JCCS-LocalProof|SHA256-ChainedProof|{hash[:32]}|{timestamp}`

4. **Verification Status Lifecycle**:
   - `local`: Cryptographically signed with local HMAC-SHA256.
   - `pending`: Dispatched to Bitcoin mempool for block inclusion.
   - `verified`: Formally anchored into a confirmed Bitcoin block.

---

## 11. Design System & UI Components

- **Theme Philosophy**: *Sovereign Dark Fortress* — authoritative, high-contrast, premium government-grade aesthetics.
- **Color Palette**:
  - **Fortress Base**: `#0a0a0f` (Deep obsidian background)
  - **Fortress Surface**: `#13131f` (Glassmorphic card container)
  - **Fortress Border**: `rgba(255, 255, 255, 0.08)`
  - **National Saffron Accent**: `#ff9933` (Brand highlight, Primary CTAs)
  - **Safety Emerald / Teal**: `#00d4aa` / `#00b894` (Compliant status, High safety)
  - **Warning Amber**: `#fdcb6e` / `#f1c40f` (Moderate risk, Action required)
  - **Critical Crimson**: `#e94560` / `#c0392b` (Non-compliant, High risk)
- **Typography Hierarchy**:
  - **Headings**: `Space Grotesk` (Geometric, commanding, modern)
  - **Body / Interface**: `Inter` (Legible, crisp UI copy)
  - **Data / Hashes**: `JetBrains Mono` (Cryptographic proofs, JSON inspect)
- **Key Visual Components**:
  - **Bharat Safety Gauge**: SVG neon gauge arc displaying dynamic color transitions based on score.
  - **Dimension Status Bars**: Real-time progress rails showing disparity margins and passing thresholds.
  - **Provider Grid Tiles**: One-click provider switcher with dynamic badge indicators.
  - **Live Terminal Redactor**: Automated hazard redaction filter protecting judges from viewing dangerous raw payload text.

---

## 12. Key Bugs Diagnosed & Fixed

| Bug ID | Description | Root Cause | Engineering Resolution |
| :--- | :--- | :--- | :--- |
| **BUG-01** | `NoneType.strip()` Crash on Sarvam AI | Sarvam content filters returned `null` message content on certain sensitive prompts. | Added defensive null-coalescing (`res.get('content') or ''`) before string processing in `llm_client.py`. |
| **BUG-02** | Sarvam AI 401 Unauthorized | Gateway rejected standard `Authorization: Bearer` header. | Configured `api-subscription-key` header specifically for Sarvam requests. |
| **BUG-03** | Google Gemini 404 Not Found | Calling `/v1/chat/completions` directly on Google AI Studio endpoint. | Routed requests to Google's OpenAI-compatible beta path `/openai/chat/completions`. |
| **BUG-04** | OpenRouter Free-Tier 400 Errors | Missing required routing headers (`HTTP-Referer` and `X-Title`). | Injected platform referer and title headers in OpenRouter client adapter. |
| **BUG-05** | Audit Progress Hanging at 95% | Synchronous OriginStamp network request blocked main evaluation thread on rate limits. | Wrapped blockchain anchoring in a non-blocking background daemon with instant fallback proof. |
| **BUG-06** | History Tab Empty (404 Not Found) | Router prefix mismatch (`/audit` vs `/api/audits`). | Added root endpoints `@app.get('/api/audits')` and normalized database persistence. |
| **BUG-07** | Live Real-Time Preset Incomplete | Demo preset attempted live upstream API calls without keys, causing partial evaluation. | Implemented standalone instant mock generator (`demo_service.py`) returning complete 9-dimension, 44-probe payload. |

---

## 13. File Structure

```
d:/jccs/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── audit.py             # Main audit API router & endpoints
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic environment configuration
│   │   │   └── database.py          # SQLAlchemy database engine & session
│   │   ├── models/
│   │   │   └── models.py            # AuditRun, FairnessResult, Probes ORM models
│   │   ├── routers/
│   │   │   └── batch_audit.py       # Batch evaluation router
│   │   ├── services/
│   │   │   ├── audit_service.py     # Main LLM red-teaming orchestrator
│   │   │   ├── blockchain_service.py# HMAC-SHA256 & OriginStamp Bitcoin anchoring
│   │   │   ├── demo_service.py      # Instant zero-latency mock preset generator
│   │   │   ├── evaluation_prompts.py# 44 Indic safety probes across 4 categories
│   │   │   ├── groq_service.py      # LLaMA 3.3 70B AI Judge evaluation
│   │   │   ├── llm_client.py        # Multi-provider client (Sarvam, Gemini, Groq, etc.)
│   │   │   └── llm_safety_engine.py # 9-dimension score aggregator & compliance mapper
│   │   └── main.py                  # FastAPI application entry point
│   ├── migrate_db.py                # Database migration utility
│   └── requirements.txt             # Backend Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/Navbar.jsx # Top navigation bar with status indicator
│   │   │   ├── layout/Layout.jsx    # Global responsive layout wrapper
│   │   │   └── ui/ScoreRing.jsx     # Dynamic circular score gauge
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Hero landing page with live interactive gauge
│   │   │   ├── UploadPage.jsx       # Audit launch & provider configuration
│   │   │   ├── ResultsPage.jsx      # 5-tab scorecard, prompt inspector, compliance matrix
│   │   │   └── HistoryPage.jsx      # Audit history registry & drill-down
│   │   ├── utils/
│   │   │   └── api.js               # Axios HTTP client & API route bindings
│   │   ├── App.jsx                  # React router configuration
│   │   └── index.css                # Sovereign Tailwind design tokens & animations
│   ├── package.json                 # Frontend dependencies & scripts
│   ├── tailwind.config.js           # Custom color palette & font configuration
│   └── vite.config.js               # Vite build configuration
│
├── PROJECT_DOCUMENTATION.md         # Official comprehensive documentation
└── README.md                        # Project quickstart guide
```

---

## 14. Deployment & Environment Setup

### Environment Variables (`backend/.env`)
```env
APP_NAME="JCCS - Joint Compliance & Cultural Safety"
APP_VERSION="1.0.0"
DATABASE_URL="mysql+pymysql://root:password@localhost:3306/jccs_db"
# Or for SQLite:
# DATABASE_URL="sqlite:///./jccs.db"

# AI Provider API Keys (Optional for live execution)
GROQ_API_KEY="gsk_..."
SARVAM_API_KEY="..."
GEMINI_API_KEY="..."
OPENROUTER_API_KEY="sk-or-..."

# OriginStamp Blockchain (Optional)
ORIGINSTAMP_API_KEY="..."
```

### Local Development Setup

1. **Backend Service**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scriptsctivate
   pip install -r requirements.txt
   python migrate_db.py
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Frontend SPA**:
   ```bash
   cd frontend
   npm install
   npm run dev
   # Accessible at http://localhost:5173
   ```

3. **Production Build**:
   ```bash
   cd frontend
   npm run build
   ```

### Current Repository State
- **Git Branch**: `main`
- **Latest Commit**: `4fdac75c6fde792c63cd4296c05e1e9ac767e605`
- **Status**: Clean, all automated test suites passing.

---

## 15. Future Roadmap

1. **Extended Indic Language Support**:
   - Expansion from EN/HI/TA to all 22 Eighth Schedule Indian languages (including Telugu, Kannada, Malayalam, Bengali, Marathi, and Gujarati).
2. **Real-Time Multi-Model Arena & Head-to-Head Comparison**:
   - Simultaneous side-by-side benchmark evaluation of multiple foundation models against identical probe sets.
3. **Automated Continuous CI/CD Safety Gates**:
   - GitHub Actions and Hugging Face integration for automated red-teaming prior to model checkpoint release.
4. **Custom Synthetic Probe Generator**:
   - Domain-specific probe generation for FinTech (RBI compliance), HealthTech (NDHM guidelines), and E-Governance.
5. **National Registry Integration**:
   - Direct reporting pipeline integration with the IndiaAI Safety Institute portal.

---
*Document generated for IndiaAI Hackathon Judges & Sovereign AI Evaluation Reviewers.*
