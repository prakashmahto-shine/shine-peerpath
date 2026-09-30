from fastapi import APIRouter, HTTPException
from backend.services.analytics_service import analytics_service
from backend.data.store import store
from backend.services.milvus_service import milvus_service

router = APIRouter(tags=["Analytics & Demo"])

@router.get("/api/analytics/metrics")
def get_metrics():
    try:
        return analytics_service.get_metrics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/demo/reset")
def reset_demo():
    try:
        store.reset_to_default()
        # Re-sync milvus index
        creators = store.get_creators()
        milvus_service.sync_creators(creators)
        return {
            "success": True,
            "message": "Demo database and Milvus vector collection reset to initial state.",
            "creatorsCount": len(creators)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
