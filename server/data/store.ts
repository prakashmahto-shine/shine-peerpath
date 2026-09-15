import fs from 'fs';
import path from 'path';
import { 
  Creator, 
  CandidateProfile, 
  MentorshipSession, 
  PeerVerifiedBadge, 
  CommunityPost, 
  CommunityComment, 
  CommunityNotification, 
  CommunityReaction,
  PostAnalytics 
} from '../types';
import { 
  SEED_CREATORS, 
  SEED_CANDIDATES, 
  INITIAL_SESSIONS, 
  SEED_COMMUNITY_POSTS, 
  SEED_NOTIFICATIONS 
} from './seedData';
import { normalizeDomain } from '../services/mentorMatchTaxonomy';

interface DbSchema {
  creators: Creator[];
  candidates: CandidateProfile[];
  sessions: MentorshipSession[];
  badges: PeerVerifiedBadge[];
  posts: CommunityPost[];
  notifications: CommunityNotification[];
  reactions: CommunityReaction[];
  analytics: {
    profileUpdatesThisMonth: number;
    newRegistrationsThisMonth: number;
    totalSessionsBooked: number;
    totalActiveCreators: number;
  };
}

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'db.json');

class Store {
  private data: DbSchema;

  constructor() {
    this.data = this.loadInitialData();
  }

  private loadInitialData(): DbSchema {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Validate basic integrity and backfill community collections if missing
        if (parsed.creators && parsed.sessions && parsed.candidates) {
          if (!parsed.posts || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
            parsed.posts = JSON.parse(JSON.stringify(SEED_COMMUNITY_POSTS));
          }
          if (!parsed.notifications || !Array.isArray(parsed.notifications) || parsed.notifications.length === 0) {
            parsed.notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
          }
          if (!parsed.reactions || !Array.isArray(parsed.reactions)) {
            parsed.reactions = [];
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Store] Could not read db.json, using defaults:', err);
    }

    const defaultData: DbSchema = {
      creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
      candidates: JSON.parse(JSON.stringify(SEED_CANDIDATES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      badges: JSON.parse(JSON.stringify(SEED_CANDIDATES[0].badges)),
      posts: JSON.parse(JSON.stringify(SEED_COMMUNITY_POSTS)),
      notifications: JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)),
      reactions: [],
      analytics: {
        profileUpdatesThisMonth: 14820,
        newRegistrationsThisMonth: 6350,
        totalSessionsBooked: 2430,
        totalActiveCreators: SEED_CREATORS.length
      }
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(snapshot?: DbSchema) {
    try {
      const toSave = snapshot || this.data;
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(toSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Failed saving db.json:', err);
    }
  }

  // Creators
  public getCreators(domain?: string, query?: string): Creator[] {
    let list = this.data.creators;
    if (domain && domain !== 'all') {
      const targetNorm = normalizeDomain(domain) || domain.toLowerCase();
      list = list.filter(c => {
        const cNorm = normalizeDomain(c.domain) || c.domain.toLowerCase();
        return cNorm.toLowerCase() === targetNorm.toLowerCase() || c.domain.toLowerCase() === domain.toLowerCase();
      });
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getCreatorById(id: string): Creator | undefined {
    const clean = (id || '').trim().toLowerCase();
    return this.data.creators.find(c => c.id.toLowerCase() === clean);
  }

  public addCreator(newCreator: Creator): Creator {
    // Check if creator already exists
    const index = this.data.creators.findIndex(c => c.id === newCreator.id);
    if (index >= 0) {
      this.data.creators[index] = newCreator;
    } else {
      this.data.creators.unshift(newCreator);
      this.data.analytics.totalActiveCreators += 1;
    }
    this.saveData();
    return newCreator;
  }

  public updateCreatorRating(creatorId: string, newRating: number): Creator | undefined {
    const creator = this.getCreatorById(creatorId);
    if (creator) {
      const currentReviews = creator.reviewsCount || 1;
      const currentRating = creator.rating || 4.9;
      const totalScore = (currentRating * currentReviews) + newRating;
      creator.reviewsCount = currentReviews + 1;
      creator.rating = Number((totalScore / creator.reviewsCount).toFixed(2));
      this.saveData();
      return creator;
    }
    return undefined;
  }

  public updateCreatorAvailability(creatorId: string, days: string[], timeSlots: string[]): Creator | undefined {
    const creator = this.getCreatorById(creatorId);
    if (creator) {
      creator.availability = { days, timeSlots };
      this.saveData();
      return creator;
    }
    return undefined;
  }

  public updateCreator(creatorId: string, updates: Partial<Creator>): Creator | undefined {
    const creator = this.getCreatorById(creatorId);
    if (creator) {
      Object.assign(creator, updates);
      this.saveData();
      return creator;
    }
    return undefined;
  }

  // Sessions & Bookings
  public getSessions(userId?: string, role?: 'candidate' | 'mentor'): MentorshipSession[] {
    if (!userId) return this.data.sessions;
    if (role === 'mentor') {
      return this.data.sessions.filter(s => s.expertId === userId || s.expert.name.toLowerCase().includes(userId.toLowerCase()));
    }
    return this.data.sessions.filter(s => s.candidateId === userId || s.candidateName.toLowerCase().includes(userId.toLowerCase()));
  }

  public getSessionById(sessionId: string): MentorshipSession | undefined {
    return this.data.sessions.find(s => s.id === sessionId);
  }

  public addSession(session: MentorshipSession): MentorshipSession {
    this.data.sessions.unshift(session);
    this.data.analytics.totalSessionsBooked += 1;
    this.saveData();
    return session;
  }

  public updateSession(sessionId: string, updates: Partial<MentorshipSession>): MentorshipSession | undefined {
    const session = this.getSessionById(sessionId);
    if (session) {
      Object.assign(session, updates);
      this.saveData();
      return session;
    }
    return undefined;
  }

  // Candidates & Profile Updates
  public getCandidate(id: string): CandidateProfile | undefined {
    const lookup = id.toLowerCase();
    return this.data.candidates.find(c =>
      c.id === id ||
      c.email?.toLowerCase() === lookup ||
      (id === 'prakash' && c.id === 'prakash-mahto') ||
      (id === 'prakash-mahto' && c.id === 'prakash')
    );
  }

  public getCandidates(domain?: string, peerVerifiedOnly: boolean = false): CandidateProfile[] {
    let list = this.data.candidates;
    if (peerVerifiedOnly) {
      list = list.filter(c => c.badges && c.badges.length > 0);
    }
    if (domain && domain !== 'all') {
      const d = domain.toLowerCase();
      list = list.filter(c => 
        (c.targetRole && c.targetRole.toLowerCase().includes(d)) ||
        (c.headline && c.headline.toLowerCase().includes(d)) ||
        c.skills.some(s => s.toLowerCase().includes(d))
      );
    }
    return list;
  }

  public updateCandidate(id: string, updates: Partial<CandidateProfile>): CandidateProfile | undefined {
    const cand = this.getCandidate(id);
    if (cand) {
      Object.assign(cand, updates);
      this.data.analytics.profileUpdatesThisMonth += 1;
      this.saveData();
      return cand;
    }
    return undefined;
  }

  public awardBadgeToCandidate(candidateId: string, badge: PeerVerifiedBadge): CandidateProfile | undefined {
    const cand = this.getCandidate(candidateId);
    if (cand) {
      cand.badges = [badge, ...cand.badges.filter(b => b.title !== badge.title)];
      cand.profileScore = Math.min(100, (cand.profileScore || 75) + 8);
      cand.recruiterSearchMultiplier = Math.min(5.0, (cand.recruiterSearchMultiplier || 1.5) + 0.6);
      this.data.badges.unshift(badge);
      this.data.analytics.profileUpdatesThisMonth += 1;
      this.saveData();
      return cand;
    }
    return undefined;
  }

  // ==============================================================================
  // Community Posts, Comments, Reactions & Analytics Repository
  // ==============================================================================

  public getCommunityPosts(options?: {
    tag?: string;
    mentorId?: string;
    search?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }): { posts: CommunityPost[]; total: number } {
    let posts = [...this.data.posts];

    if (options?.mentorId) {
      posts = posts.filter(p => p.mentorId.toLowerCase() === options.mentorId!.toLowerCase());
    }

    if (options?.tag && options.tag !== 'All Topics' && options.tag !== 'all') {
      const targetTag = options.tag.toLowerCase();
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === targetTag || t.toLowerCase().includes(targetTag)));
    }

    if (options?.search) {
      const q = options.search.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.mentorName.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    const total = posts.length;

    // Set likedByCurrentUser flag based on reactions
    const currentUserId = options?.userId || 'prakash';
    const userLikedPostIds = new Set(
      this.data.reactions
        .filter(r => r.userId === currentUserId && r.targetType === 'post')
        .map(r => r.targetId)
    );

    const mappedPosts = posts.map(p => {
      const isLiked = userLikedPostIds.has(p.id) || !!p.likedByCurrentUser;
      return {
        ...p,
        likedByCurrentUser: isLiked
      };
    });

    return { posts: mappedPosts, total };
  }

  public getPostById(postId: string, userId?: string): CommunityPost | undefined {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post) return undefined;

    const currentUserId = userId || 'prakash';
    const isLiked = this.data.reactions.some(r => r.userId === currentUserId && r.targetType === 'post' && r.targetId === postId);

    return {
      ...post,
      likedByCurrentUser: isLiked || !!post.likedByCurrentUser
    };
  }

  public createCommunityPost(post: CommunityPost): CommunityPost {
    this.data.posts.unshift(post);
    this.saveData();
    return post;
  }

  public togglePostLike(postId: string, userId: string): { post: CommunityPost; liked: boolean } | undefined {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post) return undefined;

    const existingIndex = this.data.reactions.findIndex(
      r => r.targetType === 'post' && r.targetId === postId && r.userId === userId
    );

    let liked = false;
    if (existingIndex >= 0) {
      this.data.reactions.splice(existingIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
      post.likedByCurrentUser = false;
      liked = false;
    } else {
      this.data.reactions.push({
        id: `rx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        targetType: 'post',
        targetId: postId,
        userId,
        reactionType: 'like',
        createdAt: new Date().toISOString()
      });
      post.likesCount += 1;
      post.likedByCurrentUser = true;
      liked = true;

      // Update analytics reach/reactions if available
      if (post.analytics) {
        post.analytics.engagements += 1;
        if (post.analytics.reactionsBreakdown) {
          post.analytics.reactionsBreakdown.likes += 1;
        }
      }
    }

    this.saveData();
    return { post, liked };
  }

  public addComment(postId: string, comment: CommunityComment): CommunityComment | undefined {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post) return undefined;

    if (!post.comments) post.comments = [];
    post.comments.push(comment);
    post.commentsCount = post.comments.length;

    if (post.analytics) {
      post.analytics.commentsCount = post.comments.length;
      post.analytics.engagements += 1;
    }

    this.saveData();
    return comment;
  }

  public toggleCommentLike(postId: string, commentId: string, userId: string): { comment: CommunityComment; liked: boolean } | undefined {
    const post = this.data.posts.find(p => p.id === postId);
    if (!post) return undefined;

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return undefined;

    const existingIndex = this.data.reactions.findIndex(
      r => r.targetType === 'comment' && r.targetId === commentId && r.userId === userId
    );

    let liked = false;
    if (existingIndex >= 0) {
      this.data.reactions.splice(existingIndex, 1);
      comment.likesCount = Math.max(0, comment.likesCount - 1);
      comment.likedByCurrentUser = false;
      liked = false;
    } else {
      this.data.reactions.push({
        id: `rx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        targetType: 'comment',
        targetId: commentId,
        userId,
        reactionType: 'like',
        createdAt: new Date().toISOString()
      });
      comment.likesCount += 1;
      comment.likedByCurrentUser = true;
      liked = true;
    }

    this.saveData();
    return { comment, liked };
  }

  public getPostAnalytics(postId: string): PostAnalytics | undefined {
    const post = this.data.posts.find(p => p.id === postId);
    return post?.analytics;
  }

  // ==============================================================================
  // Notifications Repository
  // ==============================================================================

  public getNotifications(userId?: string, unreadOnly: boolean = false): CommunityNotification[] {
    let list = this.data.notifications;
    if (userId) {
      list = list.filter(n => !n.recipientId || n.recipientId === userId || n.recipientId === 'all');
    }
    if (unreadOnly) {
      list = list.filter(n => !n.isRead);
    }
    return list;
  }

  public getUnreadNotificationCount(userId?: string): number {
    return this.getNotifications(userId, true).length;
  }

  public createNotification(notification: CommunityNotification): CommunityNotification {
    this.data.notifications.unshift(notification);
    this.saveData();
    return notification;
  }

  public markNotificationAsRead(id: string): CommunityNotification | undefined {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveData();
      return notif;
    }
    return undefined;
  }

  public markAllNotificationsAsRead(userId: string): number {
    let count = 0;
    this.data.notifications.forEach(n => {
      if ((!n.recipientId || n.recipientId === userId || n.recipientId === 'all') && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    if (count > 0) {
      this.saveData();
    }
    return count;
  }

  public deleteNotification(id: string): boolean {
    const initialLen = this.data.notifications.length;
    this.data.notifications = this.data.notifications.filter(n => n.id !== id);
    if (this.data.notifications.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  public clearAllNotifications(userId?: string): number {
    const initialLen = this.data.notifications.length;
    if (userId) {
      this.data.notifications = this.data.notifications.filter(n => n.recipientId && n.recipientId !== userId && n.recipientId !== 'all');
    } else {
      this.data.notifications = [];
    }
    const removed = initialLen - this.data.notifications.length;
    this.saveData();
    return removed;
  }

  // Analytics
  public getAnalytics() {
    return {
      ...this.data.analytics,
      verifiedCreatorsCount: this.data.creators.length,
      upcomingSessionsCount: this.data.sessions.filter(s => s.status === 'upcoming').length,
      completedSessionsCount: this.data.sessions.filter(s => s.status === 'completed').length,
      totalBadgesIssued: this.data.badges.length,
      totalCommunityPosts: this.data.posts.length,
      domainsCovered: ['Full-Stack', 'AI/ML', 'Semiconductor', 'Cybersecurity', 'SaaS Sales', 'Marketing'],
      growthStats: {
        profileUpdateRateGain: '+68% vs baseline jobs platform',
        passiveRegistrationsInUnderservedDomains: '42% from Topmate/LinkedIn referral',
        recruiterSearchShortlistSpeed: '3.4x faster for peer-verified candidates'
      }
    };
  }

  public resetToDefault() {
    this.data = {
      creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
      candidates: JSON.parse(JSON.stringify(SEED_CANDIDATES)),
      sessions: JSON.parse(JSON.stringify(INITIAL_SESSIONS)),
      badges: JSON.parse(JSON.stringify(SEED_CANDIDATES[0].badges)),
      posts: JSON.parse(JSON.stringify(SEED_COMMUNITY_POSTS)),
      notifications: JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)),
      reactions: [],
      analytics: {
        profileUpdatesThisMonth: 14820,
        newRegistrationsThisMonth: 6350,
        totalSessionsBooked: 2430,
        totalActiveCreators: SEED_CREATORS.length
      }
    };
    this.saveData();
    return this.data;
  }
}

export const store = new Store();

