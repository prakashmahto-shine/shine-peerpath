from typing import Dict, Any
from fastapi import APIRouter, HTTPException
from backend.data.store import store

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

@router.get("/{candidate_id}")
def get_candidate_profile(candidate_id: str):
    try:
        candidate = store.get_candidate(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
        return {"success": True, "data": candidate}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{candidate_id}")
def update_candidate_profile(candidate_id: str, updates: Dict[str, Any]):
    try:
        updated = store.update_candidate(candidate_id, updates)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Candidate {candidate_id} not found")
        return {"success": True, "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
