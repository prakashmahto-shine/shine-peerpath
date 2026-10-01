from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Body
from backend.models.schemas import NotificationSendInput
from backend.services.notification_service import notification_service

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(userId: Optional[str] = None, unreadOnly: Optional[bool] = False):
    try:
        notifs = notification_service.get_user_notifications(user_id=userId, unread_only=unreadOnly or False)
        unread_count = notification_service.get_unread_count(user_id=userId)
        return {
            "success": True,
            "data": notifs,
            "meta": {
                "total": len(notifs),
                "unreadCount": unread_count
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/unread-count")
def get_unread_count(userId: Optional[str] = None):
    try:
        unread_count = notification_service.get_unread_count(user_id=userId)
        return {
            "success": True,
            "data": {
                "unreadCount": unread_count
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("")
def send_notification(payload: NotificationSendInput):
    try:
        created = notification_service.send_notification(payload)
        return {
            "success": True,
            "message": "Notification sent successfully",
            "data": created
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{notification_id}/read")
def mark_as_read(notification_id: str):
    try:
        updated = notification_service.mark_as_read(notification_id)
        if not updated:
            raise HTTPException(status_code=404, detail=f"Notification {notification_id} not found")
        return {
            "success": True,
            "message": "Notification marked as read",
            "data": updated
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mark-all-read")
def mark_all_as_read(payload: dict = Body(default={})):
    try:
        user_id = payload.get("userId", "prakash")
        count = notification_service.mark_all_as_read(user_id)
        return {
            "success": True,
            "message": f"{count} notifications marked as read",
            "data": {"markedCount": count}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clear-all")
@router.delete("")
def clear_all_notifications(payload: dict = Body(default={})):
    try:
        user_id = payload.get("userId", "prakash")
        cleared = notification_service.clear_all(user_id)
        return {
            "success": True,
            "message": f"{cleared} notifications cleared",
            "data": {"clearedCount": cleared}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{notification_id}")
def delete_notification(notification_id: str):
    try:
        deleted = notification_service.delete_notification(notification_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Notification {notification_id} not found")
        return {
            "success": True,
            "message": "Notification deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
