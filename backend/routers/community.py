from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Body
from backend.models.schemas import PostCreateInput, CommentCreateInput
from backend.services.community_service import community_service

router = APIRouter(prefix="/api/community", tags=["Community"])

@router.get("/posts")
def get_posts(tag: Optional[str] = None, mentorId: Optional[str] = None, userId: Optional[str] = None):
    try:
        posts = community_service.get_posts(tag=tag, mentor_id=mentorId, user_id=userId)
        return {"success": True, "count": len(posts), "data": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts")
def create_post(payload: PostCreateInput):
    try:
        post = community_service.create_post(payload)
        return {"success": True, "message": "Mentor discussion post published!", "data": post}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/{post_id}/comments")
def add_comment(post_id: str, payload: CommentCreateInput):
    try:
        comment = community_service.add_comment(post_id, payload)
        if not comment:
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")
        return {"success": True, "message": "Comment posted successfully", "data": comment}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/{post_id}/like")
def toggle_post_like(post_id: str, payload: dict = Body(default={})):
    try:
        user_id = payload.get("userId", "prakash")
        result = community_service.toggle_post_like(post_id, user_id)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts/{post_id}/comments/{comment_id}/like")
def toggle_comment_like(post_id: str, comment_id: str, payload: dict = Body(default={})):
    try:
        user_id = payload.get("userId", "prakash")
        result = community_service.toggle_comment_like(post_id, comment_id, user_id)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
