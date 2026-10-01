import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "backend" / "data"
DB_PATH = DATA_DIR / "db.json"
if not DB_PATH.exists():
    fallback_path = BASE_DIR / "server" / "data" / "db.json"
    if fallback_path.exists():
        DB_PATH = fallback_path
MILVUS_DATA_DIR = BASE_DIR / "milvus_data"
MILVUS_DB_PATH = MILVUS_DATA_DIR / "peerpath.db"

# Server configuration
PORT = int(os.getenv("PORT", os.getenv("API_PORT", 5001)))
HOST = os.getenv("HOST", "0.0.0.0")

# Milvus configuration
# If an external Milvus server is provided, use it (e.g. http://localhost:19530 or https://in03-xxx.zillizcloud.com)
MILVUS_URI = os.getenv("MILVUS_URI", "")
MILVUS_TOKEN = os.getenv("MILVUS_TOKEN", "")

# Embedding configuration
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "all-MiniLM-L6-v2")
EMBEDDING_DIM = 384
