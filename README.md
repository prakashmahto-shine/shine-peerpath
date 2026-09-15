# 🧭 Shine Peerpath

> **1:1 Trajectory Mentorship & Career Transition Marketplace for Shine.com (HT Media Group)**

Shine Peerpath bridges high-growth domain career transitions (AI/ML, Semiconductor, Cybersecurity, Full-Stack, SaaS Sales) by connecting ambitious candidates directly with verified industry leaders through 1:1 guidance calls, structured gap assessments, and recruiter priority verification.

---

## 📂 Project Structure & Architecture

This repository is structured as a **clean, production-ready Full-Stack Monorepo**:

```text
shine-peerpath/
├── src/                        # 🌐 FRONTEND APPLICATION (React 18 + Vite + TS)
│   ├── components/             # Reusable UI components & modals
│   │   ├── layout/             # Header, Navigation, Footer
│   │   ├── modals/             # BookingModal, TrajectoryCalibrationModal, etc.
│   │   └── views/              # Main view screens:
│   │       ├── LoginView.tsx           # Shine SSO / 1-Click Persona Login
│   │       ├── CareerGuidanceView.tsx  # Calibrated Trajectory Feed & Mentors
│   │       ├── ExpertsMarketplaceView.tsx # Mentor Directory & Filters
│   │       ├── CommunityView.tsx       # Live Peer Discussions & Threads
│   │       ├── MySessionsView.tsx      # Video Calls & Schedule Manager
│   │       └── ...
│   ├── context/                # Global state (AppContext.tsx)
│   ├── services/               # API clients & retry mechanisms (api.ts)
│   ├── styles/                 # Theme tokens & CSS (index.css)
│   ├── types/                  # Shared UI TypeScript interfaces
│   └── main.tsx & App.tsx      # Frontend Entry points
│
├── server/                     # ⚙️ BACKEND API SERVICE (Node.js + Express + TS)
│   ├── data/                   # Persistent storage & seed state (db.json)
│   ├── routes/                 # Express API routing controllers:
│   │   ├── cvRoutes.ts         # CV Parsing & Textract heuristic extractor
│   │   ├── trajectoryRoutes.ts # AI career trajectory matching engine
│   │   ├── creatorRoutes.ts    # Creator onboarding & profile sync
│   │   ├── candidateRoutes.ts  # Candidate profile management
│   │   ├── bookingRoutes.ts    # 1:1 Session slot bookings & payments
│   │   ├── assessmentRoutes.ts # Session rubrics & peer badges
│   │   ├── recruiterRoutes.ts  # Recruiter talent discovery pipeline
│   │   ├── analyticsRoutes.ts  # Shine ecosystem metrics & telemetry
│   │   └── jobRoutes.ts        # Direct job board integrations
│   ├── services/               # Backend business logic & scoring
│   ├── types.ts                # Backend data models & API contracts
│   └── index.ts                # Express API server entry & static dist fallback
│
├── public/                     # Static public assets (avatars, icons)
├── docs/                       # Technical specifications & Deployment guides
│   ├── DEPLOYMENT.md           # Step-by-step production deployment manual
│   └── embeddings.md           # AI Trajectory vector matching docs
│
├── .env.example                # Sample environment configuration
├── Dockerfile                  # Production multi-stage Docker build
├── docker-compose.yml          # Container orchestration configuration
├── ecosystem.config.cjs        # PM2 process manager configuration for VMs
├── package.json                # Orchestration scripts for Frontend & Backend
└── tsconfig.json               # TypeScript compiler options
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
You can run both Frontend and Backend concurrently with a single command:
```bash
npm run start:all
```
- 🌐 **Frontend (Vite)**: `http://localhost:4242`
- ⚙️ **Backend API**: `http://localhost:5001/api`
- 🩺 **Health Check**: `http://localhost:5001/api/health`

### Individual Service Scripts:
```bash
# Run only Frontend Dev Server (port 4242)
npm run dev:frontend

# Run only Backend API Server with hot reload (port 5001)
npm run dev:backend

# Run API test suite
npm run test:api
```

---

## 🚀 Production Build & Deployment

### Build Frontend Bundle
```bash
npm run build
```
This outputs minified production assets to the `dist/` directory.

### Start Production Server (Unified)
```bash
npm run start
```
The Express backend automatically serves `/api/*` endpoints and serves the static `dist/index.html` single-page application for all client routes.

For containerized (Docker), PM2, or decoupled CDN deployment guides, refer to [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 🔒 Environment Configuration

Copy `.env.example` to `.env` to customize settings:
```bash
cp .env.example .env
```
| Key | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | Backend API Server Port |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `VITE_API_URL` | *(empty)* | Optional remote API URL for decoupled CDN builds |

---

## 📄 License & Enterprise Ownership
Proprietary — Developed for **Shine.com (HT Media Group)**.
