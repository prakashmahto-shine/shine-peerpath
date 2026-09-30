from typing import Optional
from fastapi import APIRouter, HTTPException
from backend.models.schemas import CheckoutPayload, ReschedulePayload
from backend.services.booking_service import booking_service

router = APIRouter(tags=["Bookings & Payments"])

@router.get("/api/bookings")
def get_sessions(userId: Optional[str] = None, role: Optional[str] = None):
    try:
        sessions = booking_service.get_all_sessions(user_id=userId, role=role)
        return {"success": True, "count": len(sessions), "data": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/bookings/{session_id}")
def get_session_by_id(session_id: str):
    try:
        session = booking_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail=f"Session with ID {session_id} not found")
        return {"success": True, "data": session}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/payments/checkout")
@router.post("/api/bookings/checkout")
def checkout_session(payload: CheckoutPayload):
    try:
        result = booking_service.process_checkout(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/bookings/{session_id}/cancel")
def cancel_session(session_id: str):
    try:
        cancelled = booking_service.cancel_session(session_id)
        return {"success": True, "data": cancelled}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/bookings/{session_id}/reschedule")
def reschedule_session(session_id: str, payload: ReschedulePayload):
    try:
        rescheduled = booking_service.reschedule_session(session_id, payload.newDate, payload.newTimeSlot)
        return {"success": True, "data": rescheduled}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
