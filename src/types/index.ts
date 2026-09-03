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
