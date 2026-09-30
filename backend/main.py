import os
import time
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import PORT, HOST, EMBEDDING_MODEL_NAME
from backend.data.store import store
from backend.services.milvus_service import milvus_service
from backend.routers import (
    cv_router,
    trajectory_router,
    creators_router,
    candidates_router,
    bookings_router,
    assessment_router,
    recruiter_router,
    analytics_router,
    jobs_router
)

START_TIME = time.time()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("====================================================")
    print("🚀 Initializing Shine Peerpath Python Backend & Milvus...")
    try:
        # Initialize Milvus connection and collections
        milvus_service.connect()
        creators = store.get_creators()
        candidates = store.get_candidates()
        print(f"📦 Loaded {len(creators)} mentors and {len(candidates)} candidates from Store.")
        
        # Index data into Milvus Vector DB
        milvus_service.sync_creators(creators)
        milvus_service.sync_candidates(candidates)
        print("🎯 Milvus Vector Indexing ready for Trajectory Matching & Recruiter Neural Search!")
    except Exception as e:
        print(f"⚠️ Milvus startup warning: {e}")
    print("====================================================")
    yield
    print("🛑 Shutting down backend...")
    milvus_service.shutdown()

app = FastAPI(
    title="Shine Peerpath Backend API (Python & Milvus)",
    description="Python FastAPI backend with Milvus Vector Database trajectory matching",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logger middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    print(f"[API] {request.method} {request.url.path} -> {response.status_code} ({duration}ms)")
    return response

# Health check
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "shine-peerpath-backend-api-python",
        "vectorDatabase": "Milvus",
        "embeddingModel": EMBEDDING_MODEL_NAME,
        "uptimeSeconds": round(time.time() - START_TIME),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "domainsSupported": ['AI/ML', 'Semiconductor', 'Cybersecurity', 'Full-Stack', 'SaaS Sales', 'Marketing', 'Product Management', 'Search & Data Infra'],
        "version": "2.0.0"
    }

# Register Subsystem Routers
app.include_router(cv_router)
app.include_router(trajectory_router)
app.include_router(creators_router)
app.include_router(candidates_router)
app.include_router(bookings_router)
app.include_router(assessment_router)
app.include_router(recruiter_router)
app.include_router(analytics_router)
app.include_router(jobs_router)

# Serve static frontend build if dist/ exists
dist_path = Path(__file__).resolve().parent.parent / "dist"
if dist_path.exists():
    app.mount("/assets", StaticFiles(directory=str(dist_path / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"error": "API route not found"})
        target = dist_path / full_path
        if target.is_file():
            return FileResponse(str(target))
        index_file = dist_path / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        return JSONResponse(status_code=200, content={"message": "Shine Peerpath Python Backend running!"})

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting Uvicorn on {HOST}:{PORT}")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
