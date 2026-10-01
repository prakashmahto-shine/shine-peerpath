import time
from typing import List, Optional, Dict, Any
from backend.data.store import store
from backend.models.schemas import CommunityPost, CommunityComment, PostCreateInput, CommentCreateInput

class CommunityService:
    def get_posts(self, tag: Optional[str] = None, mentor_id: Optional[str] = None, user_id: Optional[str] = None) -> List[CommunityPost]:
        return store.get_posts(tag=tag, mentor_id=mentor_id, user_id=user_id)

    def create_post(self, payload: PostCreateInput) -> CommunityPost:
        post_id = f"post-{int(time.time() * 1000)}"
        new_post = CommunityPost(
            id=post_id,
            mentorId=payload.mentorId,
            mentorName=payload.mentorName,
            mentorRole=payload.mentorRole,
            mentorCompany=payload.mentorCompany,
            mentorAvatar=payload.mentorAvatar or '/avatars/akash.jpg',
            title=payload.title,
            content=payload.content,
            tags=payload.tags or [],
            createdAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            likes=0,
            comments=[],
            likedBy=[]
        )
        created = store.create_post(new_post)
        try:
            import asyncio
            from backend.services.socket_service import broadcast_new_post
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(broadcast_new_post(created.model_dump()))
        except Exception:
            pass
        return created

    def add_comment(self, post_id: str, payload: CommentCreateInput) -> Optional[CommunityComment]:
        comment_id = f"comm-{int(time.time() * 1000)}"
        comment = CommunityComment(
            id=comment_id,
            authorId=payload.authorId,
            authorName=payload.authorName,
            authorRole=payload.authorRole,
            authorAvatar=payload.authorAvatar or '/avatars/prakash.jpg',
            authorIsMentor=payload.authorIsMentor or False,
            content=payload.content,
            createdAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            likes=0,
            likedBy=[]
        )
        created_comment = store.add_comment_to_post(post_id, comment)
        if created_comment:
            try:
                import asyncio
                from backend.services.socket_service import broadcast_new_comment
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(broadcast_new_comment(post_id, created_comment.model_dump()))
            except Exception:
                pass
        return created_comment

    def toggle_post_like(self, post_id: str, user_id: str) -> Dict[str, Any]:
        return store.toggle_post_like(post_id, user_id)

    def toggle_comment_like(self, post_id: str, comment_id: str, user_id: str) -> Dict[str, Any]:
        return store.toggle_comment_like(post_id, comment_id, user_id)

community_service = CommunityService()
