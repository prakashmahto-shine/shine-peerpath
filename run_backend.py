import uvicorn
from backend.config import HOST, PORT

if __name__ == "__main__":
    print(f"🚀 Launching Shine Peerpath Python + Milvus backend on http://{HOST}:{PORT}")
    uvicorn.run("backend.main:app", host=HOST, port=PORT, reload=True)
