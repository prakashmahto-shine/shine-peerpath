# Shine Peerpath — Python & Milvus Architecture

1:1 Career Guidance & Expert Mentorship Marketplace for Shine.com powered by **FastAPI** and **Milvus Vector Database**.

---

## 🌟 Overview & Key Features

- **Milvus Vector-Powered Trajectory Matching**: Matches candidates against mentors who had their exact CV 3 years ago and successfully made the jump to Tier-1 product companies using dense 384-dimensional vector embeddings (`all-MiniLM-L6-v2`) and Milvus cosine similarity.
- **4-Way Career Alignment**: Combines dense vector similarity with role family taxonomy, company tiers (S&P 500, Indian Unicorns, NSE-listed), and transition classification.
- **CV Gap Analysis & Dynamic Booster Scores**: Identifies missing high-leverage booster skills across 6+ underserved verticals (AI/ML, Semiconductor, Cybersecurity, Full-Stack, Product Management, Search & Data Infra).
- **Zero-Prep Mentor Dossier**: Pre-loads STAR interview rubrics and tailored focus areas for seamless 1:1 sessions.
- **Peer-Verified Badges & Recruiter Search**: Issues tamper-proof peer credentials and neural candidate search for recruiters.

---

## 🏗️ Architecture

```
shine-peerpath/
├── backend/                  # Python FastAPI Backend
│   ├── main.py               # App entrypoint & Milvus lifespan manager
│   ├── config.py             # Server & Milvus configs
│   ├── models/schemas.py     # Pydantic data schemas
│   ├── data/
│   │   ├── store.py          # Data access layer & persistence
│   │   ├── company_tiers.py  # Tier-0, Tier-1, Tier-2 classification sets
│   │   └── jobs_db.py        # Verified Shine jobs database
│   ├── services/
│   │   ├── milvus_service.py # PyMilvus vector database integration
│   │   ├── embedding_service.py # SentenceTransformers (all-MiniLM-L6-v2)
│   │   ├── trajectory_service.py # 4-Way Career Alignment + Milvus matching
│   │   ├── cv_service.py     # CV parsing & gap analysis
│   │   ├── recruiter_service.py # Neural candidate matching
│   │   ├── assessment_service.py# Zero-prep dossier & badge issuance
│   │   ├── booking_service.py# Checkout & session scheduling
│   │   ├── creator_service.py# Mentor onboarding & availability
│   │   └── analytics_service.py # Marketplace KPIs
│   └── routers/              # FastAPI APIRouters (/api/*)
├── src/                      # React Frontend (Vite + TypeScript)
├── requirements.txt          # Python dependencies
└── package.json              # NPM scripts & frontend dependencies
```

---

## 🚀 Getting Started

### 1. Setup Python Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Python Backend (FastAPI + Milvus)
```bash
# Option A: using npm script
npm run server

# Option B: using python runner
python3 run_backend.py
```
The API server starts on `http://localhost:5001` with Milvus Vector Database running and collections initialized.

### 3. Start Frontend (Vite)
```bash
npm run dev
```
The frontend starts on `http://localhost:4242` and proxies `/api` calls directly to the Python backend on `5001`.

### 4. Run Python Backend Test Suite
```bash
source .venv/bin/activate
python3 test_python_backend.py
```

---

## 🔌 API Endpoints

- `GET /api/health` — Service health & Milvus vector status
- `POST /api/trajectory/match` — Vector-powered trajectory matching with Milvus
- `POST /api/cv/gap-analysis` — 5-domain CV gap analysis & booster recommendations
- `POST /api/cv/parse` — Raw resume text parser
- `GET /api/creators` — Filtered mentor listing
- `POST /api/creators/register` — Mentor onboarding with auto-vectorization into Milvus
- `POST /api/payments/checkout` — Mock UPI/Card checkout & instant session booking
- `GET /api/creator/sessions/{id}/briefing` — Zero-prep mentor dossier
- `POST /api/sessions/{id}/assess` — Badge issuance & profile score boost
- `POST /api/recruiter/match` — Neural candidate search for recruiters
- `GET /api/jobs` — Verified job listings
