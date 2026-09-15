import { ViewType } from '../types';

/**
 * Route / Page Definition for Shine Peerpath
 */
export interface RouteDefinition {
  id: string;
  name: string;
  path: string;
  aliases: string[];
  view: ViewType;
  title: string;
  description: string;
  category: 'candidate' | 'mentor' | 'recruiter' | 'shared' | 'auth';
  requiresAuth?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

/**
 * Master Registry of all URLs, Paths, and Views across Shine Peerpath
 */
export const PEERPATH_ROUTES: RouteDefinition[] = [
  {
    id: 'career-guidance',
    name: 'Career Guidance & Skill Gap Analyzer',
    path: '/peerpath',
    aliases: ['/', '/guidance', '/career-guidance', '/myshine', '/dashboard'],
    view: 'guidance-view',
    title: 'Career Guidance & Upward Trajectory | Shine Peerpath',
    description: 'Personalized AI skill-gap analyzer and career trajectory roadmap',
    category: 'candidate'
  },
  {
    id: 'candidate-profile',
    name: 'Candidate Profile & Peer Badges',
    path: '/profile',
    aliases: ['/my-profile', '/candidate-profile'],
    view: 'profile-view',
    title: 'Candidate Profile & Verified Badges | Shine Peerpath',
    description: 'Peer-verified credentials, skill portfolio, and recruiter search score',
    category: 'candidate',
    requiresAuth: true
  },
  {
    id: 'matching-jobs',
    name: 'Matching Jobs & Gap Analysis',
    path: '/jobs',
    aliases: ['/job-search', '/matching-jobs', '/new-job-search'],
    view: 'jobs-view',
    title: 'Matched Tier-1 Jobs | Shine Peerpath',
    description: 'Live job openings matched with high-growth pathway tracks',
    category: 'candidate'
  },
  {
    id: 'experts-directory',
    name: '1:1 Mentors Directory',
    path: '/experts',
    aliases: ['/mentors', '/browse-mentors'],
    view: 'experts-view',
    title: 'Book 1:1 Mentorship from Domain Leaders | Shine Peerpath',
    description: 'Browse verified mentors across AI/ML, Semiconductor, Cybersecurity & Full-Stack',
    category: 'candidate'
  },
  {
    id: 'expert-profile',
    name: 'Mentor Profile & Teaser Dossier',
    path: '/expert/:id',
    aliases: ['/expert', '/mentor/:id', '/mentor-profile'],
    view: 'expert-profile-view',
    title: 'Mentor Profile & 1:1 Booking | Shine Peerpath',
    description: 'Detailed trajectory jump story, availability calendar, and verified badge portfolio',
    category: 'candidate'
  },
  {
    id: 'community-feed',
    name: 'Community & Mentor Insights',
    path: '/community',
    aliases: ['/feed', '/discussions'],
    view: 'community-view',
    title: 'Technical Community & System Design Insights | Shine Peerpath',
    description: 'Deep-dive technical discussions, interview architectures, and mentor AMA threads',
    category: 'shared'
  },
  {
    id: 'checkout-payment',
    name: '1:1 Session Checkout',
    path: '/checkout',
    aliases: ['/payment', '/pay'],
    view: 'payment-view',
    title: 'Confirm & Book Mentorship Slot | Shine Peerpath',
    description: 'Secure slot reservation and payment processing',
    category: 'candidate',
    requiresAuth: true
  },
  {
    id: 'booking-confirmed',
    name: 'Booking Confirmed',
    path: '/confirmed',
    aliases: ['/success', '/booked'],
    view: 'confirmed-view',
    title: 'Booking Confirmed | Shine Peerpath',
    description: 'Session confirmation, Google Meet calendar invite, and preparation tips',
    category: 'candidate'
  },
  {
    id: 'my-sessions',
    name: 'My Mentorship Sessions',
    path: '/sessions',
    aliases: ['/my-sessions', '/bookings', '/schedule'],
    view: 'sessions-view',
    title: 'My Mentorship Schedule & Recordings | Shine Peerpath',
    description: 'Upcoming video calls, recorded teardowns, and verified peer certificates',
    category: 'shared',
    requiresAuth: true
  },
  {
    id: 'live-call',
    name: 'Live 1:1 Video Call Room',
    path: '/live-call',
    aliases: ['/call', '/room/peerpath-session', '/room/:id'],
    view: 'live-call-view',
    title: 'Live Mentorship Room | Shine Peerpath',
    description: 'WebRTC video call with zero-prep cockpit, code sharing, and live recording',
    category: 'shared',
    hideHeader: false,
    hideFooter: true
  },
  {
    id: 'post-session-feedback',
    name: 'Post-Session Evaluation & Rating',
    path: '/post-session',
    aliases: ['/session/feedback', '/feedback', '/review'],
    view: 'post-session-view',
    title: 'Session Rating & Feedback | Shine Peerpath',
    description: 'Candidate review, mentor rating, and badge endorsement feedback',
    category: 'candidate'
  },
  {
    id: 'recruiter-portal',
    name: 'Recruiter Shortlist & Verified Search',
    path: '/recruiter',
    aliases: ['/recruiters', '/talent-search', '/hire'],
    view: 'recruiter-view',
    title: 'Recruiter Search: 3.4x Faster Peer-Verified Talent | Shine Peerpath',
    description: 'Direct candidate sourcing with cryptographic peer-verified skill badges',
    category: 'recruiter'
  },
  {
    id: 'mentor-dashboard',
    name: 'Mentor Studio & Earnings Cockpit',
    path: '/mentor-dashboard',
    aliases: ['/mentor', '/mentor-portal', '/creator-studio', '/creator', '/creator-dashboard'],
    view: 'mentor-dashboard-view',
    title: 'Mentor Studio & Earnings Analytics | Shine Peerpath',
    description: 'Session calendar, zero-prep candidate dossiers, reach analytics, and payout tracker',
    category: 'mentor',
    requiresAuth: true
  },
  {
    id: 'login-auth',
    name: 'Sign In / Sign Up',
    path: '/login',
    aliases: ['/signin', '/pages/myshine/login'],
    view: 'login-view',
    title: 'Sign In | Shine Peerpath',
    description: 'Access candidate career dashboard or mentor studio',
    category: 'auth',
    hideHeader: true,
    hideFooter: true
  }
];

/**
 * Universal Path-to-View Matcher for browser URL routing
 */
export function pathToView(pathname: string): { view: ViewType; expertId?: string; route?: RouteDefinition } {
  const clean = pathname.replace(/\/$/, '') || '/';

  // Parameterized dynamic routes (e.g. /expert/saheli)
  if (clean.startsWith('/expert/') || clean.startsWith('/mentor/')) {
    const segments = clean.split('/');
    const expertId = segments[2];
    const route = PEERPATH_ROUTES.find(r => r.view === 'expert-profile-view');
    return { view: 'expert-profile-view', expertId, route };
  }

  if (clean.startsWith('/room/')) {
    const route = PEERPATH_ROUTES.find(r => r.view === 'live-call-view');
    return { view: 'live-call-view', route };
  }

  // Exact path or alias match
  for (const route of PEERPATH_ROUTES) {
    if (route.path === clean || route.aliases.includes(clean)) {
      return { view: route.view, route };
    }
  }

  // Default fallback route
  const defaultRoute = PEERPATH_ROUTES[0];
  return { view: defaultRoute.view, route: defaultRoute };
}

/**
 * Universal View-to-Path URL Generator
 */
export function viewToPath(view: ViewType, params?: { expertId?: string }): string {
  if (view === 'expert-profile-view' && params?.expertId) {
    return `/expert/${params.expertId}`;
  }
  const route = PEERPATH_ROUTES.find(r => r.view === view);
  return route ? route.path : '/peerpath';
}

/**
 * Get route metadata by ViewType
 */
export function getRouteByView(view: ViewType): RouteDefinition {
  return PEERPATH_ROUTES.find(r => r.view === view) || PEERPATH_ROUTES[0];
}
