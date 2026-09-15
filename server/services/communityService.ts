import { store } from '../data/store';
import { CommunityPost, CommunityComment, PostAnalytics } from '../types';
import { broadcastNewPost, broadcastNewComment } from './socketService';
import { notificationService } from './notificationService';

export interface CreatePostDto {
  mentorId: string;
  mentorName?: string;
  mentorRole?: string;
  mentorCompany?: string;
  mentorAvatar?: string;
  title: string;
  content: string;
  tags?: string[];
}

export interface AddCommentDto {
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorIsMentor?: boolean;
  content: string;
  parentCommentId?: string;
}

class CommunityService {
  /**
   * Fetch paginated & filtered community posts
   */
  public getPosts(options?: {
    tag?: string;
    mentorId?: string;
    search?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }) {
    return store.getCommunityPosts(options);
  }

  /**
   * Fetch single post with full discussion thread
   */
  public getPostById(postId: string, userId?: string): CommunityPost | null {
    const post = store.getPostById(postId, userId);
    return post || null;
  }

  /**
   * Create a new technical post/insight from a verified mentor
   */
  public createPost(dto: CreatePostDto): CommunityPost {
    if (!dto.mentorId) {
      throw new Error('mentorId is required to create a community post');
    }
    if (!dto.title || dto.title.trim().length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }
    if (!dto.content || dto.content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters long');
    }

    const mentor = store.getCreatorById(dto.mentorId);

    const postId = `post-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newPost: CommunityPost = {
      id: postId,
      mentorId: dto.mentorId,
      mentorName: dto.mentorName || mentor?.name || 'Verified Mentor',
      mentorRole: dto.mentorRole || mentor?.role || 'Staff Engineer',
      mentorCompany: dto.mentorCompany || mentor?.company || 'Peerpath Partner',
      mentorAvatar: dto.mentorAvatar || mentor?.avatar || '/avatars/saheli.jpg',
      title: dto.title.trim(),
      content: dto.content.trim(),
      tags: dto.tags && dto.tags.length > 0 ? dto.tags : ['Career Jump', 'System Design', 'Interview Prep'],
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByCurrentUser: false,
      commentsCount: 0,
      comments: [],
      analytics: {
        impressions: 120,
        reach: 95,
        engagements: 1,
        engagementRate: '1.2%',
        reactionsBreakdown: { likes: 0, hearts: 0, insightful: 0 },
        commentsCount: 0,
        repliesCount: 0,
        sharesCount: 0,
        profileClicks: 4,
        bookingsGenerated: 0,
        revenueGenerated: 0,
        topAudienceTitles: [
          { title: 'Senior Software Engineer', percentage: 45 },
          { title: 'Transitioning Engineer', percentage: 35 },
          { title: 'Technical Lead', percentage: 20 }
        ],
        topAudienceCompanies: [
          { company: mentor?.company || 'Tech Enterprise', percentage: 30 },
          { company: 'Swiggy', percentage: 25 },
          { company: 'Razorpay', percentage: 20 },
          { company: 'Infosys', percentage: 15 }
        ],
        topLocations: [
          { city: 'Bengaluru', percentage: 50 },
          { city: 'Hyderabad', percentage: 30 },
          { city: 'Pune', percentage: 20 }
        ]
      }
    };

    const saved = store.createCommunityPost(newPost);

    // Broadcast over real-time socket
    broadcastNewPost(saved);

    // Notify registered candidates about the new post
    notificationService.sendNotification({
      recipientId: 'prakash',
      type: 'mentor_post',
      mentorId: saved.mentorId,
      mentorName: saved.mentorName,
      mentorAvatar: saved.mentorAvatar,
      postId: saved.id,
      title: 'New Technical Post',
      message: `${saved.mentorName} posted: "${saved.title.length > 60 ? saved.title.substring(0, 57) + '...' : saved.title}"`
    });

    return saved;
  }

  /**
   * Toggle like reaction on a post
   */
  public togglePostLike(postId: string, userId: string = 'prakash') {
    const result = store.togglePostLike(postId, userId);
    if (!result) {
      throw new Error(`Post with ID ${postId} not found`);
    }

    // Trigger notification to author if someone else liked
    if (result.liked && result.post.mentorId !== userId) {
      notificationService.sendNotification({
        recipientId: result.post.mentorId,
        type: 'post_like',
        actorId: userId,
        actorName: 'Prakash Mahto',
        actorAvatar: '/avatars/prakash.jpg',
        postId: result.post.id,
        title: 'New Like on your Post',
        message: `Prakash Mahto liked your insight: "${result.post.title.substring(0, 50)}..."`
      });
    }

    return result;
  }

  /**
   * Add a comment to a discussion thread
   */
  public addComment(dto: AddCommentDto): CommunityComment {
    if (!dto.postId) throw new Error('postId is required');
    if (!dto.content || dto.content.trim().length === 0) throw new Error('Comment content cannot be empty');

    const post = store.getPostById(dto.postId);
    if (!post) throw new Error(`Post with ID ${dto.postId} not found`);

    const commentId = `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newComment: CommunityComment = {
      id: commentId,
      postId: dto.postId,
      parentCommentId: dto.parentCommentId || null,
      authorId: dto.authorId || 'prakash',
      authorName: dto.authorName || 'Prakash Mahto',
      authorRole: dto.authorRole || 'Senior Engineer',
      authorAvatar: dto.authorAvatar || '/avatars/prakash.jpg',
      authorIsMentor: dto.authorIsMentor ?? false,
      content: dto.content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByCurrentUser: false
    };

    const saved = store.addComment(dto.postId, newComment);
    if (!saved) throw new Error('Failed to save comment');

    // Broadcast comment over WebSocket
    broadcastNewComment(dto.postId, saved);

    // Notify post author if commenter is different
    if (post.mentorId !== dto.authorId) {
      notificationService.sendNotification({
        recipientId: post.mentorId,
        type: 'comment_reply',
        actorId: dto.authorId,
        actorName: dto.authorName,
        actorAvatar: dto.authorAvatar,
        postId: post.id,
        title: 'New Comment on your Post',
        message: `${dto.authorName} commented: "${dto.content.length > 60 ? dto.content.substring(0, 57) + '...' : dto.content}"`
      });
    }

    return saved;
  }

  /**
   * Toggle like on a comment
   */
  public toggleCommentLike(postId: string, commentId: string, userId: string = 'prakash') {
    const result = store.toggleCommentLike(postId, commentId, userId);
    if (!result) {
      throw new Error(`Comment ${commentId} on post ${postId} not found`);
    }
    return result;
  }

  /**
   * Get Reach & Performance Analytics for a post
   */
  public getPostAnalytics(postId: string): PostAnalytics {
    const analytics = store.getPostAnalytics(postId);
    if (!analytics) {
      throw new Error(`Analytics for post ${postId} not found`);
    }
    return analytics;
  }
}

export const communityService = new CommunityService();
