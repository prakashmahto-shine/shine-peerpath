# 🚀 Shine Peerpath — Production Deployment Guide

This document outlines the architecture and step-by-step instructions for deploying the **Shine Peerpath** platform into production environments.

---

## 🏛️ Architecture Overview

The repository is structured as a **unified full-stack application**:
- **Frontend (`src/`)**: React 18, TypeScript, Vite, responsive UI and Peerpath trajectory views.
- **Backend (`server/`)**: Express.js, TypeScript (`tsx`), modular API routes (`/api/cv`, `/api/trajectory`, `/api/bookings`, `/api/candidates`, etc.), AI scoring engine, and persistent storage in `server/data/db.json`.

```text
                                 ┌─────────────────────────────────┐
                                 │   Shine.com Gateway / ALB / CDN │
                                 └────────────────┬────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                  [Static Assets]                                   [API Requests]
                         │                                                 │
                         ▼                                                 ▼
             ┌───────────────────────┐                         ┌───────────────────────┐
             │ Frontend (React/Vite) │                         │ Express Backend API   │
             │   dist/index.html     │◄──[Fallback Proxy]──────┤   server/index.ts     │
             │   dist/assets/*       │                         │   port: 5001          │
             └───────────────────────┘                         └───────────┬───────────┘
                                                                           │
                                                               ┌───────────▼───────────┐
                                                               │ Embedded / DB Storage │
                                                               │   server/data/db.json │
                                                               └───────────────────────┘
```

---

## 🛠️ Deployment Options

### Option 1: Unified Container Deployment (Docker / ECS / Kubernetes) ⭐ *Recommended*

The included multi-stage `Dockerfile` compiles the React frontend to `/app/dist` and packages the Express backend into a lightweight Node.js runtime image.

```bash
# 1. Build the Docker Image
docker build -t shine-peerpath:latest .

# 2. Run the Container
docker run -d \
  --name shine-peerpath \
  -p 5001:5001 \
  -e NODE_ENV=production \
  -e PORT=5001 \
  --restart unless-stopped \
  shine-peerpath:latest
```

Health check endpoint: `http://localhost:5001/api/health`

---

### Option 2: Linux VM / EC2 Deployment with PM2 (Process Manager)

If deploying to a dedicated virtual machine or EC2 instance running Ubuntu/RHEL:

1. **Install Dependencies and Build**:
   ```bash
   npm ci
   npm run build
   ```

2. **Start Backend Service via PM2**:
   ```bash
   # Install PM2 globally if not already present
   npm install -g pm2

   # Start cluster using the provided configuration
   pm2 start ecosystem.config.cjs

   # Save configuration to resurrect across reboots
   pm2 save
   pm2 startup
   ```

3. **Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/peerpath.shine.com`)**:
   ```nginx
   server {
       listen 80;
       server_name peerpath.shine.com;

       location / {
           proxy_pass http://127.0.0.1:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

---

### Option 3: Decoupled Deployment (Frontend on S3/CloudFront CDN + Backend API on Node Cluster)

If your team prefers hosting static React assets on a high-speed CDN:

1. **Build Frontend**:
   ```bash
   VITE_API_URL=https://api.peerpath.shine.com npm run build
   ```
   Deploy the contents of `dist/` directly to AWS S3 + CloudFront (or Akamai CDN).

2. **Run Backend API Server**:
   ```bash
   PORT=5001 NODE_ENV=production npm run start
   ```

---

## 🔒 Environment Variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5001` | Express backend server listening port |
| `API_PORT` | `5001` | Alternative alias for backend port |
| `NODE_ENV` | `development` | Runtime mode (`development` or `production`) |
| `VITE_API_URL` | *(empty)* | Optional external API URL for decoupled frontend builds |

---

## 🔍 Verification & Health Monitoring

- **Health Endpoint**: `GET /api/health`
  ```json
  {
    "status": "ok",
    "service": "shine-peerpath-backend-api",
    "uptimeSeconds": 1420,
    "timestamp": "2026-09-15T10:00:00.000Z",
    "domainsSupported": ["AI/ML", "Semiconductor", "Cybersecurity", "Full-Stack", "SaaS Sales", "Marketing"],
    "version": "1.0.0"
  }
  ```
- **Test Suite Endpoint Validation**:
  ```bash
  node server/test-api.mjs
  ```
