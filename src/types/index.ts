export interface Expert {
  id: string;
  name: string;
  role: string;
  company: string;
  domain: string;
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
  isVerifiedEmployer?: boolean;
  followersCount?: number;
  trajectory?: {
    role3YearsAgo: string;
    company3YearsAgo: string;
    salary3YearsAgo: string;
    keyJumpSkills: string[];
    jumpStory: string;
  };
  availability?: {
    days: string[];
    timeSlots: string[];
  };
}

export type ViewType = 
  | 'dashboard-view'
  | 'profile-view'
  | 'guidance-view'
  | 'jobs-view'
  | 'experts-view'
  | 'expert-profile-view'
  | 'payment-view'
  | 'confirmed-view'
  | 'sessions-view'
  | 'live-call-view'
  | 'post-session-view'
  | 'recruiter-view'
  | 'mentor-dashboard-view'
  | 'login-view';

export interface BookingDetails {
  expert: Expert;
  date: string;
  timeSlot: string;
  price: number;
  sessionType?: string;
  duration?: string;
}

export interface MentorshipSession {
  id: string;
  expert: Expert;
  candidateName: string;
  candidateRole?: string;
  candidateAvatar?: string;
  candidateGoal?: string;
  date: string;
  timeSlot: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  badgeAwarded?: string;
  feedbackNotes?: string;
  rating?: number;
  meetingLink?: string;
}

export interface PeerVerifiedBadge {
  id: string;
  title: string;
  subtitle: string;
  verifierName: string;
  verifierRole: string;
  verifierCompany?: string;
  verifierAvatar: string;
  date: string;
  skills: string[];
  status: 'verified' | 'in-progress';
  credentialId?: string;
  verificationUrl?: string;
  qrCodeUrl?: string;
  badgeLevel?: string;
  scorePercentile?: string;
  rubricSummary?: string;
}

export interface UserProfileData {
  name: string;
  headline: string;
  experienceYears: string;
  location: string;
  profileScore: number;
  jobSearchStatus: string;
  summary: string;
  skills: string[];
  badges: PeerVerifiedBadge[];
  email: string;
  phone: string;
  currentCtc?: string;
  targetCtc?: string;
  targetRole?: string;
  resumeFileName?: string;
  resumeLastUpdated?: string;
  educationDegree?: string;
  educationCollege?: string;
  pastCompany?: string;
  pastCompanyRole?: string;
  isMentor?: boolean;
  mentorRating?: number;
  mentorReviewsCount?: number;
  mentorEarnings?: number;
  mentorSessionsCount?: number;
  mentorRate?: number;
  mentorDuration?: number;
  mentorAvailability?: { days: string[]; timeSlots: string[] };
  mentorTeaserVideo?: {
    url: string;
    title: string;
    duration?: string;
    thumbnail?: string;
    uploadedAt?: string;
  } | null;
  hasExpertBadge?: boolean;
  isMentorEligible?: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: 'candidate' | 'mentor';
  avatar: string;
  email: string;
  headline: string;
  company?: string;
  experienceYears?: string;
  location?: string;
  earnings?: number;
  rating?: number;
  reviewsCount?: number;
  completedSessionsCount?: number;
  hasExpertBadge?: boolean;
  isMentorEligible?: boolean;
}

export interface PeerpathJobContext {
  isFromPeerpath: boolean;
  trackKey: string;
  trackTitle: string;
  targetRole: string;
  targetPackage: string;
  requiredBoosterSkills: string[];
}

export interface TrajectoryMatch {
  creator: Expert;
  trajectorySimilarityScore: number;
  jumpDelta: string;
  matchReasons: string[];
  criticalBoosterSkills: string[];
  suggestedSessionGoal: string;
}

export interface GapAnalysisResult {
  candidateRole: string;
  targetRole: string;
  targetDomain: string;
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

export interface ShineJob {
  id: string;
  title: string;
  company: string;
  companyInitials?: string;
  companyColor?: string;
  postedTime: string;
  exp: string;
  salary: string;
  salaryNum?: number;
  loc: string;
  domain: string;
  requiredSkills: string[];
  isActivelyHiring?: boolean;
  isEarlyApplicant?: boolean;
  description?: string;
}

export type PathwayTrackKey = 'arch' | 'pm' | 'search' | 'ai' | 'semi';
