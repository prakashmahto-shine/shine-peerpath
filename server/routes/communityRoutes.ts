import { Router, Request, Response } from 'express';
import { communityService } from '../services/communityService';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/community/posts - List posts with topic filtering, search & pagination
router.get('/posts', (req: Request, res: Response) => {
  try {
    const tag = req.query.tag as string | undefined;
    const mentorId = req.query.mentorId as string | undefined;
    const search = req.query.search as string | undefined;
    const userId = req.query.userId as string | undefined;
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;

    const result = communityService.getPosts({
      tag,
      mentorId,
      search,
      userId,
      limit,
      page
    });

    const response: ApiResponse = {
      success: true,
      data: result.posts,
      meta: {
        total: result.total,
        page,
        limit,
        filter: { tag, mentorId, search }
      }
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error fetching community posts' });
  }
});

// GET /api/community/posts/:id - Fetch single post
router.get('/posts/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const userId = req.query.userId as string | undefined;
    const post = communityService.getPostById(postId, userId);

    if (!post) {
      return res.status(404).json({ success: false, error: `Post with ID ${postId} not found` });
    }

    const response: ApiResponse = {
      success: true,
      data: post
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error fetching post' });
  }
});

// POST /api/community/posts - Create a new mentor post
router.post('/posts', (req: Request, res: Response) => {
  try {
    const { mentorId, mentorName, mentorRole, mentorCompany, mentorAvatar, title, content, tags } = req.body;

    if (!mentorId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'mentorId, title, and content are required fields'
      });
    }

    const newPost = communityService.createPost({
      mentorId,
      mentorName,
      mentorRole,
      mentorCompany,
      mentorAvatar,
      title,
      content,
      tags
    });

    const response: ApiResponse = {
      success: true,
      data: newPost,
      message: 'Post published successfully and broadcasted to community'
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || 'Error creating post' });
  }
});

// POST /api/community/posts/:id/like - Toggle post reaction
router.post('/posts/:id/like', (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const userId = (req.body?.userId || req.query?.userId || 'prakash') as string;

    const result = communityService.togglePostLike(postId, userId);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.liked ? 'Post liked' : 'Post unliked'
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message || 'Error toggling like' });
  }
});

// GET /api/community/posts/:id/analytics - Get post reach and conversion metrics
router.get('/posts/:id/analytics', (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const analytics = communityService.getPostAnalytics(postId);

    const response: ApiResponse = {
      success: true,
      data: analytics
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message || 'Analytics not found for post' });
  }
});

// GET /api/community/posts/:id/comments - Get comments for a post
router.get('/posts/:id/comments', (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const post = communityService.getPostById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: `Post with ID ${postId} not found` });
    }

    const response: ApiResponse = {
      success: true,
      data: post.comments || [],
      meta: { total: post.comments?.length || 0 }
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error fetching comments' });
  }
});

// POST /api/community/posts/:id/comments - Add a new comment / reply
router.post('/posts/:id/comments', (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const { authorId, authorName, authorRole, authorAvatar, authorIsMentor, content, parentCommentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment content is required' });
    }

    const comment = communityService.addComment({
      postId,
      authorId: authorId || 'prakash',
      authorName: authorName || 'Prakash Mahto',
      authorRole: authorRole || 'Senior Frontend Engineer',
      authorAvatar: authorAvatar || '/avatars/prakash.jpg',
      authorIsMentor: !!authorIsMentor,
      content,
      parentCommentId
    });

    const response: ApiResponse = {
      success: true,
      data: comment,
      message: 'Comment posted successfully'
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || 'Error posting comment' });
  }
});

// POST /api/community/posts/:id/comments/:commentId/like - Toggle comment like
router.post('/posts/:id/comments/:commentId/like', (req: Request<{ id: string; commentId: string }>, res: Response) => {
  try {
    const postId = req.params.id as string;
    const commentId = req.params.commentId as string;
    const userId = (req.body?.userId || req.query?.userId || 'prakash') as string;

    const result = communityService.toggleCommentLike(postId, commentId, userId);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.liked ? 'Comment liked' : 'Comment unliked'
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message || 'Error toggling comment like' });
  }
});

export default router;
