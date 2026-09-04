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
}

export type ViewType = 
  | 'dashboard-view'
  | 'profile-view'
  | 'guidance-view'
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
  verifierAvatar: string;
  date: string;
  skills: string[];
  status: 'verified' | 'in-progress';
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
  resumeFileName?: string;
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

