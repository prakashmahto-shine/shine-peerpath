export type DomainVertical = 'AI/ML' | 'Semiconductor' | 'Cybersecurity' | 'Full-Stack' | 'SaaS Sales' | 'Marketing' | 'Product Management' | 'Search & Data Infra' | 'Others';

export interface CreatorTrajectory {
  role3YearsAgo: string;
  company3YearsAgo: string;
  salary3YearsAgo: string;
  keyJumpSkills: string[];
  jumpStory: string;
}

export interface Creator {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: DomainVertical;
  experience: string;
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
  price: number;
  location: string;
  duration: string;
  avatar: string;
  videoPoster: string;
  teaserTitle: string;
  skills: string[];
  bio: string;
  verifiedEmail: string;
  isVerifiedEmployer: boolean;
  trajectory: CreatorTrajectory;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  experienceYears: string;
  location: string;
  profileScore: number;
  jobSearchStatus: string;
  summary: string;
  skills: string[];
  currentCtc?: string;
  targetCtc?: string;
  targetRole?: string;
  targetCompany?: string;
  pastCompany?: string;
  pastCompanyRole?: string;
  educationDegree?: string;
  educationCollege?: string;
  domain?: DomainVertical;
  badges: PeerVerifiedBadge[];
  recruiterSearchMultiplier?: number;
}

export interface PeerVerifiedBadge {
  id: string;
  title: string;
  subtitle: string;
  verifierName: string;
  verifierRole: string;
  verifierAvatar: string;
  verifierCompany: string;
  date: string;
  skills: string[];
  status: 'verified' | 'in-progress';
  verificationHash?: string;
}

export interface MentorshipSession {
  id: string;
  expertId: string;
  expert: Creator;
  candidateId: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar: string;
  candidateGoal: string;
  candidateEmail?: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink: string;
  badgeAwarded?: string;
  feedbackNotes?: string;
  rating?: number;
  paymentId?: string;
  amountPaid?: number;
  bookedAt: string;
  recordingUrl?: string;
  recordingDuration?: number;
  hasRecording?: boolean;
}

export interface TrajectoryMatch {
  creator: Creator;
  trajectorySimilarityScore: number;
  jumpDelta: string;
  matchReasons: string[];
  criticalBoosterSkills: string[];
  suggestedSessionGoal: string;
  isExactMatch: boolean;
  matchType: 'exact-dream' | 'exact-company' | 'exact-role' | 'aligned';
}

export interface GapAnalysisResult {
  candidateRole: string;
  targetRole: string;
  targetDomain: DomainVertical;
  currentSalaryBaseline: string;
  targetSalaryPotential: string;
  estimatedJump: string;
  currentScore: number;
  targetScore: number;
  matchedSkills: string[];
  missingBoosterSkills: string[];
  trajectoryRecommendation: string;
  recommendedCreators: TrajectoryMatch[];
  openingsCount?: number;
  hiringCompanies?: string;
}

export interface ZeroPrepDossier {
  sessionId: string;
  candidate: {
    name: string;
    headline: string;
    experienceYears: string;
    currentCtc?: string;
    targetCtc?: string;
    targetRole?: string;
    skills: string[];
    summary: string;
  };
  gapReport: {
    missingSkills: string[];
    targetJump: string;
    suggestedFocusAreas: string[];
  };
  recommendedAssessmentRubric: {
    category: string;
    criteria: string[];
  }[];
  quickDiscussionPrompts: string[];
}

// ==============================================================================
// Community & Notification Data Models (Enterprise Decoupled Schema)
// ==============================================================================

export interface CommunityComment {
  id: string;
  postId: string;
  parentCommentId?: string | null;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorIsMentor?: boolean;
  content: string;
  createdAt: string;
  likesCount: number;
  likedByCurrentUser?: boolean;
}

export interface PostAnalytics {
  impressions: number;
  reach: number;
  engagements: number;
  engagementRate: string;
  reactionsBreakdown: {
    likes: number;
    hearts: number;
    insightful: number;
  };
  commentsCount: number;
  repliesCount: number;
  sharesCount: number;
  profileClicks: number;
  bookingsGenerated: number;
  revenueGenerated: number;
  topAudienceTitles: { title: string; percentage: number }[];
  topAudienceCompanies: { company: string; percentage: number }[];
  topLocations: { city: string; percentage: number }[];
}

export interface CommunityPost {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany: string;
  mentorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
  likedByCurrentUser?: boolean;
  commentsCount: number;
  comments: CommunityComment[];
  analytics?: PostAnalytics;
}

export interface CommunityReaction {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  userId: string;
  reactionType: 'like' | 'heart' | 'insightful';
  createdAt: string;
}

export type NotificationType = 
  | 'mentor_post' 
  | 'comment_reply' 
  | 'post_like' 
  | 'comment_like' 
  | 'session_booking' 
  | 'system_announcement';

export interface CommunityNotification {
  id: string;
  recipientId?: string; // Target user or 'all'
  type: NotificationType;
  mentorId?: string;
  mentorName?: string;
  mentorAvatar?: string;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  postId?: string;
  sessionId?: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

// Standard API Response Envelope
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    unreadCount?: number;
    [key: string]: any;
  };
}

