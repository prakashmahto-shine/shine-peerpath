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
  | 'recruiter-view';

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
}
