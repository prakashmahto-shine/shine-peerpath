import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Expert, MentorshipSession, PeerVerifiedBadge, UserProfileData, ViewType, 
  UserAccount, PeerpathJobContext, BootcampMasterclass, NamedExpertInvite,
  CommunityPost, CommunityComment, CommunityNotification
} from '../types';
import { peerpathApi } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface AppContextType {
  // Navigation
  currentView: ViewType;
  previousView: ViewType;
  navigate: (view: ViewType, customPath?: string) => void;

  // Authentication & Dual Roles (Prakash ⇄ Akash ⇄ Nisha)
  currentUser: UserAccount | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (username: string) => void;
  resetDemoData: (targetUser?: string) => void;

  // Experts & Mentors
  experts: Expert[];
  selectedExpert: Expert;
  setSelectedExpert: (expert: Expert) => void;
  selectExpertById: (expertId: string) => void;
  addExpert: (expert: Omit<Expert, 'id'> | Expert) => Expert;

  // Sessions Management
  sessions: MentorshipSession[];
  activeSession: MentorshipSession | null;
  setActiveSession: (session: MentorshipSession | null) => void;
  bookSession: (expert: Expert, date: string, timeSlot: string, attachedCvName?: string) => MentorshipSession;
  cancelSession: (sessionId: string) => void;
  rescheduleSession: (sessionId: string, newDate: string, newTimeSlot: string) => void;
  completeSession: (sessionId: string, rating: number, notes: string, badgeTitle?: string) => void;

  // Candidate Profile Data
  userProfile: UserProfileData;
  updateUserProfile: (profile: Partial<UserProfileData>) => void;
  updateProfileSummary: (summary: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  awardBadge: (badge: PeerVerifiedBadge) => void;
  updateJobSearchStatus: (status: string) => void;

  // Mentor Settings & Teaser Video
  mentorAvailability: { days: string[]; timeSlots: string[] };
  updateMentorAvailability: (days: string[], timeSlots: string[]) => void;
  updateMentorRatesAndAvailability: (rate: number, duration: number, days: string[], timeSlots: string[]) => void;
  updateMentorTeaserVideo: (teaser: { url: string; title: string; duration?: string; thumbnail?: string; uploadedAt?: string } | null) => void;

  // Creator / Mentor Studio Mode (Candidate View ⇄ Creator Studio)
  isCreatorMode: boolean;
  setIsCreatorMode: (enabled: boolean) => void;
  toggleCreatorMode: () => void;
  creatorActiveTab: 'bookings' | 'reviews' | 'availability' | 'profile-settings' | 'teaser' | 'pricing' | 'history';
  setCreatorActiveTab: (tab: 'bookings' | 'reviews' | 'availability' | 'profile-settings' | 'teaser' | 'pricing' | 'history') => void;
  navigateToCreatorStudio: (tab?: 'bookings' | 'reviews' | 'availability' | 'profile-settings' | 'teaser' | 'pricing' | 'history') => void;

  // Modals
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isCreatorWizardOpen: boolean;
  setIsCreatorWizardOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAssessmentModalOpen: boolean;
  setIsAssessmentModalOpen: (open: boolean) => void;
  isCvSyncModalOpen: boolean;
  setIsCvSyncModalOpen: (open: boolean) => void;
  updateCandidateResume: (fileName: string, extractedSkills?: string[], targetCtc?: string) => void;
  removeCandidateResume: () => void;
  assessmentDraftSession: MentorshipSession | null;
  setAssessmentDraftSession: (session: MentorshipSession | null) => void;
  bookingDraft: { expert: Expert; date: string; timeSlot: string; attachedCvName?: string; sessionType?: string; amount?: number; duration?: string };
  setBookingDraft: React.Dispatch<React.SetStateAction<{ expert: Expert; date: string; timeSlot: string; attachedCvName?: string; sessionType?: string; amount?: number; duration?: string }>>;

  // Trajectory Calibration (10-Second Candidate Onboarding)
  isCalibrationModalOpen: boolean;
  setIsCalibrationModalOpen: (open: boolean) => void;
  calibrateCandidateProfile: (data: {
    currentRole: string;
    currentCompany: string;
    dreamCompany: string;
    targetRole: string;
    resumeFileName?: string;
    skills?: string[];
    currentCtc?: string;
    targetCtc?: string;
  }) => void;

  // First Cohort: Bootcamps & Named Expert Invites
  bootcamps: BootcampMasterclass[];
  registeredBootcampIds: string[];
  registerForBootcamp: (bootcampId: string) => void;
  namedExpertInvite: NamedExpertInvite;

  // Global Search & Toast Notifications
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedJobCategory: string;
  setSelectedJobCategory: (category: string) => void;
  peerpathJobContext: PeerpathJobContext | null;
  setPeerpathJobContext: (ctx: PeerpathJobContext | null) => void;
  clearPeerpathJobContext: () => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Mentor Follow System
  followedMentorIds: string[];
  toggleFollowMentor: (mentorId: string, mentorName?: string) => void;
  isFollowingMentor: (mentorId: string) => boolean;

  // Community & Mentor Insights System
  communityPosts: CommunityPost[];
  createMentorPost: (postData: { title: string; content: string; tags: string[] }) => CommunityPost | null;
  addPostComment: (postId: string, content: string) => CommunityComment | null;
  togglePostLike: (postId: string) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;

  // Community Notifications (🔔)
  notifications: CommunityNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
}

const initialBadges: PeerVerifiedBadge[] = [
  {
    id: 'badge-pm-1',
    title: 'Advanced Frontend & UI Architecture',
    subtitle: 'Verified by Akash Jain • Lead Product Manager @ Shine',
    verifierName: 'Akash Jain',
    verifierRole: 'Lead Product Manager',
    verifierCompany: 'Shine (HT Media)',
    verifierAvatar: '/avatars/akash.jpg',
    date: 'Aug 24, 2026',
    skills: ['React.js 19', 'TypeScript Micro-Frontends', 'UI Performance', 'Design Systems'],
    status: 'verified',
    credentialId: 'SH-PP-84920-ARCH',
    verificationUrl: 'https://shine.com/verify/SH-PP-84920-ARCH',
    badgeLevel: 'Level 3: Architecture Master',
    scorePercentile: 'Top 5% Talent on Shine',
    rubricSummary: 'Demonstrated mastery in Module Federation, Web Vitals, and complex State Architecture during 1:1 Live Coding & System Assessment.'
  },
  {
    id: 'badge-solr-1',
    title: 'Distributed Search & Lucene Indexing',
    subtitle: 'Verified by Anirudh Sharma • Principal Search Architect @ Shine',
    verifierName: 'Anirudh Sharma',
    verifierRole: 'Principal Search Architect',
    verifierCompany: 'Shine (HT Media)',
    verifierAvatar: '/avatars/anirudh.jpg',
    date: 'Aug 12, 2026',
    skills: ['Solr Query Syntax', 'Inverted Indexing', 'Distributed Sharding', 'FastAPI'],
    status: 'verified',
    credentialId: 'SH-PP-71042-SOLR',
    verificationUrl: 'https://shine.com/verify/SH-PP-71042-SOLR',
    badgeLevel: 'Level 2: Production Ready',
    scorePercentile: 'Top 8% Search Engineers',
    rubricSummary: 'Verified in distributed sharding, query latency optimization (<15ms), and high-throughput Solr index building.'
  }
];

const initialUserProfile: UserProfileData = {
  name: 'Prakash Mahto',
  headline: 'Senior Frontend Engineer | React.js, TypeScript, Next.js UI Architect',
  experienceYears: '4 Years, 2 Months',
  location: 'Bengaluru, India',
  profileScore: 70,
  jobSearchStatus: 'Serving Notice Period (30 Days)',
  summary: 'Senior Frontend Developer with 4+ years of hands-on experience building high-traffic, resilient web applications at scale. Proficient in React.js, TypeScript, Next.js, and modern CSS architecture. Passionate about UI performance optimization, micro-frontends, and collaborating closely with product managers and backend search teams.',
  skills: ['React.js', 'TypeScript', 'Next.js', 'JavaScript (ES6+)', 'Redux Toolkit', 'Tailwind CSS / Vanilla CSS', 'REST APIs', 'Webpack / Vite', 'Jest & React Testing Library', 'Git & CI/CD'],
  badges: initialBadges,
  email: 'prakash.mahto@gmail.com',
  phone: '+91 98765 43210',
  resumeFileName: 'Prakash_Mahto_Frontend_Resume.pdf',
  resumeLastUpdated: 'Almost a year ago',
  currentCtc: '₹5.5 LPA',
  targetCtc: '₹18L - 24L',
  currentCompany: 'TCS',
  dreamCompany: 'Flipkart',
  targetRole: 'AI/ML (Generative AI & LLMs)',
  isCalibrated: true
};

const initialBootcamps: BootcampMasterclass[] = [
  {
    id: 'bootcamp-ml-101',
    title: 'Services / SDE to ML & High-Scale Systems Transition Sprint',
    domain: 'AI/ML',
    mentorName: 'Neha Sharma',
    mentorRole: 'Senior ML Engineer',
    mentorCompany: 'Swiggy',
    mentorExCompany: 'Flipkart (4 yrs)',
    mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    date: 'Saturday, 12 Sep 2026',
    time: '05:00 PM - 07:00 PM IST',
    duration: '1-Time Live Interactive Sprint',
    registeredCount: 88,
    maxCapacity: 100,
    topics: [
      'Deconstructing the Swiggy/Flipkart ML Interview Bar: What hiring managers test',
      'Real-world MLOps Blueprint: Feature Stores, Real-time Inference & Model Drift',
      'Production System Design Patterns to crack the Senior ML bar',
      'Referral Pool Activation + 5 Exclusive 1:1 Mentorship Fast-Tracks'
    ],
    takeaways: [
      'Verified ML Transition Roadmap (Step-by-Step Blueprint)',
      'Production System Design Template for RecSys & Real-time Ranking',
      'Fast-track Referral Eligibility Voucher for Tier-1 Product Companies'
    ],
    isFree: true,
    expertId: 'ishita',
    openSlotsOnEndCount: 5
  },
  {
    id: 'bootcamp-arch-201',
    title: 'Breaking the Staff Engineer Ceiling: Micro-Frontends & System Performance Sprint',
    domain: 'Full-Stack',
    mentorName: 'Saheli Kanjilal',
    mentorRole: 'Staff Frontend Architect',
    mentorCompany: 'Razorpay',
    mentorExCompany: 'TCS Services (5 yrs)',
    mentorAvatar: '/avatars/saheli.jpg',
    date: 'Sunday, 13 Sep 2026',
    time: '06:00 PM - 08:00 PM IST',
    duration: '1-Time Live Interactive Sprint',
    registeredCount: 92,
    maxCapacity: 100,
    topics: [
      'Architecting Module Federation at Razorpay scale (10M+ daily transactions)',
      'Cracking L5/L6 Staff Engineer Frontend System Design rounds',
      'Strategy playbook to jump from services to ₹26L+ Tier-1 product tech salary',
      'Candidate Portfolio Teardown & Opening 1:1 Fast-Track Review Slots'
    ],
    takeaways: [
      'Razorpay Core Web Vitals production optimization checklist',
      'L5/L6 Frontend & Micro-Frontend System Design cheatsheet',
      'Fast-track 1:1 Architecture & Resume Review Voucher'
    ],
    isFree: true,
    expertId: 'saheli',
    openSlotsOnEndCount: 3
  }
];

const defaultNamedExpertInvite: NamedExpertInvite = {
  mentorName: 'Neha Sharma',
  mentorRole: 'Senior ML Engineer',
  mentorCompany: 'Swiggy',
  mentorExCompany: 'Flipkart (4 yrs)',
  mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  domain: 'AI/ML & Platform Engineering',
  headline: 'Swiggy Senior ML Engineer • Ex-Flipkart',
  description: 'Neha, who just joined Swiggy as a Senior ML Engineer after 4 years at Flipkart, has opened 5 exclusive slots for 1:1 career conversations this month. She is specifically talking to engineers working on their ML & high-scale product transition.',
  targetAudience: 'Engineers & Developers transitioning to AI/ML & High-Scale Systems',
  totalSlots: 5,
  remainingSlots: 3,
  price: 999,
  expertId: 'ishita'
};

const DEFAULT_FALLBACK_EXPERT: Expert = {
  id: 'akash',
  name: 'Akash Jain',
  role: 'Lead Product Manager',
  company: 'Shine (HT Media)',
  domain: 'Product Management',
  experience: '7+ Years Exp.',
  rating: 4.95,
  reviewsCount: 142,
  sessionsCount: 280,
  price: 999,
  location: 'Bengaluru / Hybrid',
  duration: '01:00',
  avatar: '/avatars/akash.jpg',
  videoPoster: '/avatars/akash.jpg',
  teaserTitle: 'Teaser: Transitioning from SDE-2 to High-Impact Product Management',
  skills: ['PRD Writing', 'Product Discovery', 'Growth Metrics', 'A/B Testing'],
  bio: 'Lead PM at Shine managing Career Multiplier & Peerpath.',
  verifiedEmail: 'akash.jain@shine.com',
  isVerifiedEmployer: true
};

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    mentorId: 'saheli',
    mentorName: 'Saheli Kanjilal',
    mentorRole: 'Staff Backend & Cloud Engineer',
    mentorCompany: 'Razorpay',
    mentorAvatar: '/avatars/saheli.jpg',
    title: 'Distributed Transactions & Outbox Pattern: What we evaluate in 40LPA+ Backend Interviews',
    content: `When engineers interview for Senior Backend / Staff positions, 80% struggle to explain how to maintain consistency across microservices without distributed 2PC locks.

Here is what we look for when designing resilient payment and checkout services:
1. Idempotency Key architecture at the API gateway layer with Redis caching + database lock.
2. Transactional Outbox Pattern with Debezium CDC (Change Data Capture) or Kafka Connect.
3. Dead Letter Queues (DLQ) paired with automated exponential backoff retry workers.
4. Handling split-brain network partitions using fencing tokens.

If you are preparing for backend system design rounds this month, drop your architecture questions below and I'll break down common pitfalls!`,
    tags: ['System Design', 'Backend Architecture', 'Kafka', 'Interview Prep'],
    createdAt: '2 hours ago',
    likesCount: 52,
    likedByCurrentUser: false,
    commentsCount: 3,
    comments: [
      {
        id: 'c-1',
        postId: 'post-1',
        authorId: 'prakash',
        authorName: 'Prakash Mahto',
        authorRole: 'Senior Frontend Engineer (Transitioning to Fullstack)',
        authorAvatar: '/avatars/prakash.jpg',
        authorIsMentor: false,
        content: 'In the Outbox pattern, how do you prevent duplicated messages in Kafka if the polling worker crashes after pushing to the broker but before committing the database transaction status?',
        createdAt: '1 hour ago',
        likesCount: 6,
        likedByCurrentUser: false
      },
      {
        id: 'c-2',
        postId: 'post-1',
        authorId: 'saheli',
        authorName: 'Saheli Kanjilal',
        authorRole: 'Staff Backend & Cloud Engineer',
        authorAvatar: '/avatars/saheli.jpg',
        authorIsMentor: true,
        content: '@Prakash Great question! You should always design the downstream consumer to be idempotent. Relying on "exactly-once" delivery across broker boundaries introduces high latency. Consumer-side deduplication via an idempotency table is the industry gold standard.',
        createdAt: '45 mins ago',
        likesCount: 14,
        likedByCurrentUser: true
      },
      {
        id: 'c-3',
        postId: 'post-1',
        authorId: 'c-amit',
        authorName: 'Amit Verma',
        authorRole: 'SDE-2 @ Infosys',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        authorIsMentor: false,
        content: 'Bookmarked! Just scheduled a 1:1 session with you next Tuesday for my Razorpay interview prep!',
        createdAt: '20 mins ago',
        likesCount: 3,
        likedByCurrentUser: false
      }
    ],
    analytics: {
      impressions: 3420,
      reach: 2180,
      engagements: 142,
      engagementRate: '4.8%',
      reactionsBreakdown: { likes: 44, hearts: 6, insightful: 2 },
      commentsCount: 3,
      repliesCount: 1,
      sharesCount: 12,
      profileClicks: 64,
      bookingsGenerated: 4,
      revenueGenerated: 3596,
      topAudienceTitles: [
        { title: 'Senior Software Engineer', percentage: 42 },
        { title: 'Backend / Cloud Engineer', percentage: 28 },
        { title: 'Tech Lead & Architect', percentage: 18 },
        { title: 'Data Scientist / ML Engineer', percentage: 12 }
      ],
      topAudienceCompanies: [
        { company: 'Amazon', percentage: 22 },
        { company: 'Swiggy', percentage: 18 },
        { company: 'Razorpay', percentage: 16 },
        { company: 'TCS', percentage: 14 },
        { company: 'Microsoft', percentage: 12 }
      ],
      topLocations: [
        { city: 'Bengaluru', percentage: 48 },
        { city: 'Hyderabad', percentage: 24 },
        { city: 'Pune', percentage: 16 },
        { city: 'Delhi NCR', percentage: 12 }
      ]
    }
  },
  {
    id: 'post-2',
    mentorId: 'ishita',
    mentorName: 'Ishita Sharma',
    mentorRole: 'Senior Frontend Architect',
    mentorCompany: 'Swiggy',
    mentorAvatar: '/avatars/ishita.jpg',
    title: 'The SDE-2 to Frontend Staff Transition: Micro-Frontends, INP Optimization & Design Systems',
    content: `A common myth: "Frontend interviews are just LeetCode trees and building a todo app in React."

In top product teams, candidate evaluation at Staff/Architect level focuses heavily on:
• Module Federation orchestration and independent versioning without duplicate React runtimes.
• INP (Interaction to Next Paint) debugging: Breaking long tasks using scheduler.yield() or React 19 useTransition.
• Zero-runtime CSS vs CSS Modules trade-offs on mobile web viewports.
• Cross-team Design System governance and headless accessibility (ARIA patterns).

I'll be hosting a 1:1 roadmap teardown for candidates aiming for Tier-1 product jumps. Ask anything below regarding UI performance audits!`,
    tags: ['Frontend Architecture', 'React 19', 'Web Vitals', 'System Design'],
    createdAt: '1 day ago',
    likesCount: 84,
    likedByCurrentUser: true,
    commentsCount: 2,
    comments: [
      {
        id: 'c-4',
        postId: 'post-2',
        authorId: 'prakash',
        authorName: 'Prakash Mahto',
        authorRole: 'Senior Frontend Engineer',
        authorAvatar: '/avatars/prakash.jpg',
        authorIsMentor: false,
        content: 'We noticed a huge INP penalty when large data tables re-render on user filter inputs. Is startTransition enough, or should we use virtualization?',
        createdAt: '18 hours ago',
        likesCount: 8,
        likedByCurrentUser: false
      },
      {
        id: 'c-5',
        postId: 'post-2',
        authorId: 'ishita',
        authorName: 'Ishita Sharma',
        authorRole: 'Senior Frontend Architect',
        authorAvatar: '/avatars/ishita.jpg',
        authorIsMentor: true,
        content: '@Prakash Virtualization (e.g. TanStack Virtual) solves the DOM node ceiling. startTransition only prioritizes input responsiveness. You should combine both for sub-50ms INP!',
        createdAt: '16 hours ago',
        likesCount: 11,
        likedByCurrentUser: false
      }
    ],
    analytics: {
      impressions: 4890,
      reach: 3120,
      engagements: 216,
      engagementRate: '5.2%',
      reactionsBreakdown: { likes: 72, hearts: 9, insightful: 3 },
      commentsCount: 2,
      repliesCount: 1,
      sharesCount: 18,
      profileClicks: 92,
      bookingsGenerated: 6,
      revenueGenerated: 5394,
      topAudienceTitles: [
        { title: 'Senior Frontend Engineer', percentage: 46 },
        { title: 'Fullstack Architect', percentage: 26 },
        { title: 'UI Lead & Design Systems', percentage: 18 },
        { title: 'Product Engineer', percentage: 10 }
      ],
      topAudienceCompanies: [
        { company: 'Swiggy', percentage: 24 },
        { company: 'Flipkart', percentage: 20 },
        { company: 'Uber', percentage: 16 },
        { company: 'Infosys', percentage: 12 }
      ],
      topLocations: [
        { city: 'Bengaluru', percentage: 52 },
        { city: 'Delhi NCR', percentage: 20 },
        { city: 'Hyderabad', percentage: 16 }
      ]
    }
  },
  {
    id: 'post-3',
    mentorId: 'raghavan',
    mentorName: 'Dr. Raghavan Nair',
    mentorRole: 'Principal AI/ML Researcher & Platform Lead',
    mentorCompany: 'Qualcomm',
    mentorAvatar: '/avatars/raghavan.jpg',
    title: 'Production RAG vs Fine-Tuning in 2026: Why Enterprise Teams Don’t Fine-Tune First',
    content: `Almost every candidate I mentor asks: "Should I fine-tune Llama 3 for my company's domain or build a RAG pipeline?"

Here is what actual production metrics show across Indian tech enterprises:
1. Fine-tuning solves style and syntax, NOT fresh factual grounding. You still get hallucinations.
2. Hybrid search (Dense Embeddings + BM25 keyword matching) with a Cross-Encoder reranker yields 88%+ precision at a fraction of training compute.
3. Context chunking strategies (semantic chunking with parent-document retrievers) matter 5x more than embedding vector dimensions.

Engineers moving into Applied AI & LLM Systems: What architectures are you building right now? Share below!`,
    tags: ['Generative AI', 'LLM Architectures', 'RAG Pipelines', 'Machine Learning'],
    createdAt: '2 days ago',
    likesCount: 112,
    likedByCurrentUser: false,
    commentsCount: 2,
    comments: [
      {
        id: 'c-6',
        postId: 'post-3',
        authorId: 'c-kavita',
        authorName: 'Kavita Menon',
        authorRole: 'Data Engineer @ Fractal',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        authorIsMentor: false,
        content: 'Spot on Dr. Nair. We spent 3 weeks fine-tuning before realizing semantic chunking solved our retrieval miss rate.',
        createdAt: '1 day ago',
        likesCount: 9,
        likedByCurrentUser: false
      },
      {
        id: 'c-7',
        postId: 'post-3',
        authorId: 'prakash',
        authorName: 'Prakash Mahto',
        authorRole: 'Candidate',
        authorAvatar: '/avatars/prakash.jpg',
        authorIsMentor: false,
        content: 'Dr. Raghavan, what vector DB latency do you consider acceptable in production for sub-100ms end-to-end response times?',
        createdAt: '1 day ago',
        likesCount: 5,
        likedByCurrentUser: false
      }
    ],
    analytics: {
      impressions: 6240,
      reach: 4350,
      engagements: 340,
      engagementRate: '6.1%',
      reactionsBreakdown: { likes: 98, hearts: 10, insightful: 4 },
      commentsCount: 2,
      repliesCount: 0,
      sharesCount: 34,
      profileClicks: 148,
      bookingsGenerated: 9,
      revenueGenerated: 14391,
      topAudienceTitles: [
        { title: 'AI / ML Engineer', percentage: 48 },
        { title: 'Data Scientist', percentage: 28 },
        { title: 'Principal Researcher', percentage: 14 },
        { title: 'Software Engineer', percentage: 10 }
      ],
      topAudienceCompanies: [
        { company: 'Qualcomm', percentage: 26 },
        { company: 'NVIDIA', percentage: 22 },
        { company: 'Google', percentage: 18 },
        { company: 'Fractal', percentage: 14 }
      ],
      topLocations: [
        { city: 'Bengaluru', percentage: 46 },
        { city: 'Hyderabad', percentage: 32 },
        { city: 'Chennai', percentage: 12 }
      ]
    }
  },
  {
    id: 'post-4',
    mentorId: 'akash',
    mentorName: 'Akash Jain',
    mentorRole: 'Lead Product Manager',
    mentorCompany: 'Shine (HT Media)',
    mentorAvatar: '/avatars/akash.jpg',
    title: 'Breaking Into High-Impact Product Management: What Your Tech Background Brings to the Table',
    content: `When engineers transition to Product Management, their biggest superpower is Technical Empathy. You already understand system constraints, API latency budgets, and engineering estimation complexities.

However, the transition bottleneck is shifting from "HOW to build" to "WHY build and WHAT is the ROI".
In your transition interviews, focus on:
1. North Star Metrics vs Guardrail Metrics.
2. PRDs with clear user problem validation rather than architectural solutions.
3. First-principles unit economics and churn reduction.

Comment your current tech stack or career stage, and I will share recommended PM case frameworks!`,
    tags: ['Product Management', 'Career Transition', 'Tech to PM', 'Leadership'],
    createdAt: '3 days ago',
    likesCount: 76,
    likedByCurrentUser: false,
    commentsCount: 1,
    comments: [
      {
        id: 'c-8',
        postId: 'post-4',
        authorId: 'prakash',
        authorName: 'Prakash Mahto',
        authorRole: 'Candidate',
        authorAvatar: '/avatars/prakash.jpg',
        authorIsMentor: false,
        content: 'Akash, do you recommend technical PMs take Scrum Master or PMP certifications, or focus directly on product teardowns and case studies?',
        createdAt: '2 days ago',
        likesCount: 7,
        likedByCurrentUser: false
      }
    ],
    analytics: {
      impressions: 5120,
      reach: 3480,
      engagements: 278,
      engagementRate: '5.8%',
      reactionsBreakdown: { likes: 66, hearts: 7, insightful: 3 },
      commentsCount: 1,
      repliesCount: 0,
      sharesCount: 15,
      profileClicks: 84,
      bookingsGenerated: 5,
      revenueGenerated: 4495,
      topAudienceTitles: [
        { title: 'Senior Software Engineer (Transitioning to PM)', percentage: 44 },
        { title: 'Associate Product Manager', percentage: 28 },
        { title: 'Engineering Manager', percentage: 16 },
        { title: 'Technical Lead', percentage: 12 }
      ],
      topAudienceCompanies: [
        { company: 'Shine (HT Media)', percentage: 20 },
        { company: 'Paytm', percentage: 18 },
        { company: 'Flipkart', percentage: 16 },
        { company: 'Wipro', percentage: 14 },
        { company: 'TCS', percentage: 12 }
      ],
      topLocations: [
        { city: 'Bengaluru', percentage: 44 },
        { city: 'Delhi NCR', percentage: 28 },
        { city: 'Mumbai', percentage: 18 }
      ]
    }
  }
];

const INITIAL_NOTIFICATIONS: CommunityNotification[] = [
  {
    id: 'notif-1',
    type: 'mentor_post',
    mentorId: 'saheli',
    mentorName: 'Saheli Kanjilal',
    mentorAvatar: '/avatars/saheli.jpg',
    postId: 'post-1',
    title: 'New Technical Post',
    message: 'Saheli Kanjilal posted: "Distributed Transactions & Outbox Pattern: What we evaluate in 40LPA+ Backend Interviews"',
    createdAt: '2 hours ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'mentor_post',
    mentorId: 'ishita',
    mentorName: 'Ishita Sharma',
    mentorAvatar: '/avatars/ishita.jpg',
    postId: 'post-2',
    title: 'New Technical Post',
    message: 'Ishita Sharma posted: "The SDE-2 to Frontend Staff Transition: Micro-Frontends, INP Optimization & Design Systems"',
    createdAt: '1 day ago',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'comment_reply',
    mentorId: 'saheli',
    mentorName: 'Saheli Kanjilal',
    mentorAvatar: '/avatars/saheli.jpg',
    postId: 'post-1',
    title: 'Mentor Replied to You',
    message: 'Saheli Kanjilal replied to your question on Outbox pattern.',
    createdAt: '45 mins ago',
    isRead: true
  }
];

const DEFAULT_ACCOUNTS: Record<string, { password: string; account: UserAccount; profile: UserProfileData }> = {
  prakash: {
    password: 'shine@123',
    account: {
      id: 'prakash',
      username: 'prakash',
      name: 'Prakash Mahto',
      role: 'candidate',
      avatar: '/avatars/prakash.jpg',
      email: 'prakash.mahto@gmail.com',
      headline: 'Senior Frontend Engineer | React.js, TypeScript, Next.js UI Architect',
      company: 'Current: Tech Services',
      experienceYears: '4 Years, 2 Months',
      location: 'Bengaluru, India',
      hasExpertBadge: false,
      isMentorEligible: false
    },
    profile: initialUserProfile
  },
  akash: {
    password: 'shine@123',
    account: {
      id: 'akash',
      username: 'akash',
      name: 'Akash Jain',
      role: 'mentor',
      avatar: '/avatars/akash.jpg',
      email: 'akash.jain@shine.com',
      headline: 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart',
      company: 'Shine (HT Media)',
      experienceYears: '8 yrs 2 Months',
      location: 'Gurugram / Remote',
      earnings: 47952,
      rating: 4.95,
      reviewsCount: 142,
      completedSessionsCount: 48,
      hasExpertBadge: true,
      isMentorEligible: true
    },
    profile: {
      name: 'Akash Jain',
      headline: 'Lead Product Manager @ Shine (HT Media) • Ex-Paytm, Flipkart',
      experienceYears: '8 yrs 2 Months',
      location: 'Gurugram / Bengaluru, India',
      hasExpertBadge: true,
      isMentorEligible: true,
      profileScore: 95,
      jobSearchStatus: 'Open to High-Impact Advisory Roles',
      currentCtc: '₹34 LPA',
      targetCtc: '₹45 LPA+',
      summary: 'Lead Product Manager at Shine (HT Media) heading core Career Multiplier initiatives.',
      skills: ['Product Management', 'PRD Discovery & Roadmarking', 'Product Metrics & Analytics', 'A/B Testing', 'Go-to-Market (GTM) Strategy'],
      educationDegree: 'B.Tech + MBA',
      educationCollege: 'IIT / IIM Alumni',
      pastCompany: 'Paytm / Flipkart',
      pastCompanyRole: 'Senior Product Manager',
      badges: [],
      isMentor: true,
      email: 'akash.jain@shine.com',
      phone: '+91 98111 22334'
    }
  },
  nisha: {
    password: 'shine@123',
    account: {
      id: 'nisha',
      username: 'nisha',
      name: 'Nisha Kumari',
      role: 'mentor',
      avatar: '/avatars/nisha.jpg',
      email: 'nisha.kumari@flipkart.com',
      headline: 'Staff Frontend Architect & UI Lead @ Flipkart',
      company: 'Flipkart',
      experienceYears: '6+ Years Exp.',
      location: 'Bengaluru / Remote',
      earnings: 38970,
      rating: 4.91,
      reviewsCount: 65,
      completedSessionsCount: 32,
      hasExpertBadge: true,
      isMentorEligible: true
    },
    profile: {
      name: 'Nisha Kumari',
      headline: 'Staff Frontend Architect & UI Lead @ Flipkart',
      experienceYears: '6+ Years Exp.',
      location: 'Bengaluru / Remote',
      hasExpertBadge: true,
      isMentorEligible: true,
      profileScore: 98,
      jobSearchStatus: 'Leading Core Web at Flipkart',
      currentCtc: '₹36 LPA',
      targetCtc: '₹50 LPA+',
      summary: 'Staff Architect at Flipkart leading core web checkout teams.',
      skills: ['React 19', 'Micro-Frontends', 'System Design', 'Module Federation', 'Web Performance'],
      educationDegree: 'B.Tech Computer Science',
      educationCollege: 'NIT Trichy',
      pastCompany: 'Leading Services Tech Firm',
      pastCompanyRole: 'Senior Software Engineer',
      badges: [],
      isMentor: true,
      email: 'nisha.kumari@flipkart.com',
      phone: '+91 98222 33445'
    }
  }
};

const initialSessions: MentorshipSession[] = [
  {
    id: 'sess-1',
    expert: DEFAULT_FALLBACK_EXPERT,
    candidateName: 'Prakash Mahto',
    candidateRole: 'Senior Frontend Engineer',
    candidateAvatar: '/avatars/prakash.jpg',
    candidateGoal: 'Transition to High-Growth Product Roles / ₹18L–₹24L target & Mock Interview',
    date: 'Saturday, 5 Sep 2026',
    timeSlot: '07:00 PM - 08:00 PM',
    status: 'upcoming',
    meetingLink: 'https://meet.shine.com/room/peerpath-akash-prakash'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Dual User Management
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('shine_peerpath_current_user');
      if (savedUser === 'null') {
        return null;
      }
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return DEFAULT_ACCOUNTS.prakash.account;
    } catch {
      return DEFAULT_ACCOUNTS.prakash.account;
    }
  });

  const isLoggedIn = currentUser !== null;

  const getInitialRoute = () => {
    try {
      const clean = window.location.pathname.replace(/\/$/, '') || '/';
      const search = window.location.search;
      const urlParams = new URLSearchParams(search);
      const utmSource = urlParams.get('utm_source');
      const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign');

      if (clean === '/login' || clean === '/signin' || clean === '/pages/myshine/login') return { view: 'login-view' as ViewType };
      if (clean === '/profile' || clean === '/my-profile' || clean === '/candidate-profile') return { view: 'profile-view' as ViewType };
      if (clean === '/peerpath' || clean === '/guidance' || clean === '/career-guidance') return { view: 'guidance-view' as ViewType };
      if (clean === '/jobs' || clean === '/job-search' || clean === '/matching-jobs') return { view: 'jobs-view' as ViewType };
      if (clean === '/experts' || clean === '/mentors') return { view: 'experts-view' as ViewType };
      if (clean.startsWith('/expert/') || clean.startsWith('/mentor/')) {
        const id = clean.split('/')[2];
        return { view: 'expert-profile-view' as ViewType, expertId: id };
      }
      if (clean === '/expert' || clean === '/expert-profile') return { view: 'expert-profile-view' as ViewType };
      if (clean === '/payment' || clean === '/checkout') return { view: 'payment-view' as ViewType };
      if (clean === '/confirmed' || clean === '/success') return { view: 'confirmed-view' as ViewType };
      if (clean === '/sessions' || clean === '/my-sessions') return { view: 'sessions-view' as ViewType };
      if (clean === '/live-call' || clean === '/call') return { view: 'live-call-view' as ViewType };
      if (clean === '/post-session' || clean === '/feedback' || clean === '/review') return { view: 'post-session-view' as ViewType };
      if (clean === '/recruiter' || clean === '/recruiters') return { view: 'recruiter-view' as ViewType };
      if (clean === '/mentor-dashboard' || clean === '/mentor' || clean === '/creator-studio') return { view: 'mentor-dashboard-view' as ViewType };
      if (clean === '/community' || clean === '/feed' || clean === '/discussions') return { view: 'community-view' as ViewType };

      // If landing via Email / WhatsApp / Peerpath campaign link
      if (utmSource || campaign) {
        return { view: 'guidance-view' as ViewType };
      }
    } catch {}
    return null;
  };

  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const initRoute = getInitialRoute();
    if (initRoute) return initRoute.view;
    if (!currentUser) return 'login-view';
    if (currentUser.role === 'mentor') return 'mentor-dashboard-view';
    return 'guidance-view';
  });
  const [previousView, setPreviousView] = useState<ViewType>('guidance-view');
  
  // Dynamic Experts (Fetched from backend API on mount)
  const [experts, setExperts] = useState<Expert[]>([DEFAULT_FALLBACK_EXPERT]);
  const [selectedExpert, setSelectedExpert] = useState<Expert>(DEFAULT_FALLBACK_EXPERT);
  
  // Dynamic Sessions
  const [sessions, setSessions] = useState<MentorshipSession[]>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_sessions');
      return saved ? JSON.parse(saved) : initialSessions;
    } catch {
      return initialSessions;
    }
  });
  
  const [activeSession, setActiveSession] = useState<MentorshipSession | null>(null);

  // Dynamic User Profiles Map (Prakash, Akash, Nisha)
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfileData>>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_profiles_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          prakash: { ...DEFAULT_ACCOUNTS.prakash.profile, ...(parsed.prakash || {}) },
          akash: { ...DEFAULT_ACCOUNTS.akash.profile, ...(parsed.akash || {}) },
          nisha: { ...DEFAULT_ACCOUNTS.nisha.profile, ...(parsed.nisha || {}) }
        };
      }
      return {
        prakash: DEFAULT_ACCOUNTS.prakash.profile,
        akash: DEFAULT_ACCOUNTS.akash.profile,
        nisha: DEFAULT_ACCOUNTS.nisha.profile
      };
    } catch {
      return {
        prakash: DEFAULT_ACCOUNTS.prakash.profile,
        akash: DEFAULT_ACCOUNTS.akash.profile,
        nisha: DEFAULT_ACCOUNTS.nisha.profile
      };
    }
  });

  // Persist user profiles database to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_profiles_db', JSON.stringify(userProfiles));
    } catch (e) {
      console.warn('Failed to save userProfiles to localStorage', e);
    }
  }, [userProfiles]);

  // Fetch live creators and sessions from backend API on startup
  useEffect(() => {
    let isCurrent = true;
    const initRoute = getInitialRoute();
    const targetExpertId = initRoute?.expertId;

    peerpathApi.getCreators().then(fetched => {
      if (isCurrent && fetched && fetched.length > 0) {
        setExperts(fetched);
        if (targetExpertId) {
          const matched = fetched.find(e => e.id.toLowerCase() === targetExpertId.toLowerCase());
          if (matched) {
            setSelectedExpert(matched);
            setBookingDraft(prev => ({ ...prev, expert: matched }));
            return;
          }
        }
        setSelectedExpert(prev => (prev?.id && prev.id !== 'akash' ? prev : fetched[0]));
      }
    }).catch(err => console.log('[API getCreators]:', err));

    if (targetExpertId) {
      peerpathApi.getCreatorById(targetExpertId).then(creator => {
        if (isCurrent && creator) {
          setSelectedExpert(creator);
          setBookingDraft(prev => ({ ...prev, expert: creator }));
        }
      }).catch(err => console.log('[API getCreatorById]:', err));
    }

    peerpathApi.getSessions('prakash', 'candidate').then(fetchedSessions => {
      if (isCurrent && fetchedSessions && fetchedSessions.length > 0) {
        setSessions(fetchedSessions);
      }
    }).catch(err => console.log('[API getSessions]:', err));

    return () => {
      isCurrent = false;
    };
  }, []);

  const activeUsername = currentUser?.username || 'prakash';
  const userProfile: UserProfileData = userProfiles[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;

  // Creator / Mentor Studio Mode
  const [isCreatorMode, setIsCreatorMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_creator_mode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch {}
    try {
      const savedUser = localStorage.getItem('shine_peerpath_current_user');
      if (savedUser && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        return Boolean(parsed.role === 'mentor' || parsed.id === 'akash');
      }
    } catch {}
    return Boolean(currentUser?.role === 'mentor' || currentUser?.id === 'akash');
  });

  useEffect(() => {
    try {
      localStorage.setItem('shine_peerpath_creator_mode', JSON.stringify(isCreatorMode));
    } catch {}
  }, [isCreatorMode]);

  const toggleCreatorMode = () => {
    setIsCreatorMode(prev => !prev);
  };

  const [creatorActiveTab, setCreatorActiveTab] = useState<'bookings' | 'reviews' | 'availability' | 'profile-settings' | 'teaser' | 'pricing' | 'history'>('bookings');

  const navigateToCreatorStudio = (tab: 'bookings' | 'reviews' | 'availability' | 'profile-settings' | 'teaser' | 'pricing' | 'history' = 'bookings') => {
    setIsCreatorMode(true);
    setCreatorActiveTab(tab);
    navigate('mentor-dashboard-view');
  };

  // Mentor Availability
  const [mentorAvailability, setMentorAvailability] = useState<{ days: string[]; timeSlots: string[] }>({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM']
  });

  // Modals & UI Drafts
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isCreatorWizardOpen, setIsCreatorWizardOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState<boolean>(false);
  const [isCvSyncModalOpen, setIsCvSyncModalOpen] = useState<boolean>(false);
  const [assessmentDraftSession, setAssessmentDraftSession] = useState<MentorshipSession | null>(null);

  const [bookingDraft, setBookingDraft] = useState<{ expert: Expert; date: string; timeSlot: string; attachedCvName?: string; sessionType?: string; amount?: number; duration?: string }>({
    expert: DEFAULT_FALLBACK_EXPERT,
    date: 'Tomorrow, 5 Sep',
    timeSlot: '10:00 AM - 11:00 AM',
    attachedCvName: 'Prakash_Mahto_Frontend_Resume.pdf',
    sessionType: '1:1 Mock Interview & Case Prep',
    amount: DEFAULT_FALLBACK_EXPERT.price,
    duration: '60 Mins'
  });

  const updateCandidateResume = (fileName: string, extractedSkills?: string[], targetCtc?: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      const updatedSkills = extractedSkills && extractedSkills.length > 0 
        ? Array.from(new Set([...existing.skills, ...extractedSkills]))
        : existing.skills;
      
      const newScore = Math.min(96, Math.max(existing.profileScore + 22, 88));

      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          resumeFileName: fileName,
          resumeLastUpdated: 'Just now (AI Synced)',
          skills: updatedSkills,
          profileScore: newScore,
          targetCtc: targetCtc || existing.targetCtc || '₹24 - ₹30 LPA'
        }
      };
    });
    setBookingDraft(prev => ({ ...prev, attachedCvName: fileName }));
    showToast('📄 Resume AI Synced!', `Skills updated & profile boosted to 88%+ recruiter match!`, 'success');
  };

  const removeCandidateResume = () => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          resumeFileName: '',
          resumeLastUpdated: 'No CV uploaded',
        }
      };
    });
    setBookingDraft(prev => ({ ...prev, attachedCvName: '' }));
    showToast('🗑️ Resume Removed', 'CV removed from this session booking.', 'info');
  };

  // Trajectory Calibration (10-Second Candidate Onboarding - Opens on user click)
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState<boolean>(false);


  const calibrateCandidateProfile = (data: {
    currentRole: string;
    currentCompany: string;
    dreamCompany: string;
    targetRole: string;
    resumeFileName?: string;
    skills?: string[];
    currentCtc?: string;
    targetCtc?: string;
  }) => {
    let syncPayload: Partial<UserProfileData> = {};
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      const updatedSkills = data.skills && data.skills.length > 0
        ? Array.from(new Set([...existing.skills, ...data.skills]))
        : existing.skills;
      const headline = `${data.currentRole} @ ${data.currentCompany} ➔ Aspiring ${data.targetRole} @ ${data.dreamCompany}`;
      const resumeLastUpdated = data.resumeFileName ? 'Calibrated & Synced just now' : existing.resumeLastUpdated;
      const currentCtc = data.currentCtc || existing.currentCtc;
      const targetCtc = data.targetCtc || existing.targetCtc;
      const profileScore = Math.max(existing.profileScore, 92);

      // Mirror onto the canonical backend field names (pastCompany/pastCompanyRole/targetCompany)
      // as well as the newer currentCompany/dreamCompany ones, so both read paths stay in sync
      // and the persisted db.json record actually reflects the calibrated trajectory.
      syncPayload = {
        headline,
        pastCompany: data.currentCompany,
        pastCompanyRole: data.currentRole,
        currentCompany: data.currentCompany,
        targetCompany: data.dreamCompany,
        dreamCompany: data.dreamCompany,
        targetRole: data.targetRole,
        skills: updatedSkills,
        resumeFileName: data.resumeFileName || existing.resumeFileName,
        currentCtc,
        targetCtc,
        profileScore
      };

      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          ...syncPayload,
          isCalibrated: true,
          calibratedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          resumeLastUpdated
        }
      };
    });
    syncCandidateProfile(activeUsername, syncPayload);
    setIsCalibrationModalOpen(false);
    showToast('🎯 Trajectory Calibrated!', `Matching you with verified mentors who transitioned from ${data.currentCompany} to ${data.dreamCompany}!`, 'success');
  };

  // First Cohort: Bootcamps & Named Expert Invites
  const [bootcamps] = useState<BootcampMasterclass[]>(initialBootcamps);
  const [registeredBootcampIds, setRegisteredBootcampIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shine_peerpath_registered_bootcamps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const registerForBootcamp = (bootcampId: string) => {
    if (registeredBootcampIds.includes(bootcampId)) {
      showToast('Already Enrolled', 'You already have a confirmed seat for this live transition sprint.', 'info');
      return;
    }

    // Strict 1-Time Free Sprint Limit per Candidate Profile
    if (registeredBootcampIds.length >= 1) {
      showToast(
        '⚠️ 1-Time Free Sprint Limit Reached',
        'Each candidate is entitled to 1 free transition campaign sprint. For continuous 1:1 mentorship and mock interviews, please book a 1:1 session.',
        'info'
      );
      return;
    }

    const updated = [...registeredBootcampIds, bootcampId];
    setRegisteredBootcampIds(updated);
    try {
      localStorage.setItem('shine_peerpath_registered_bootcamps', JSON.stringify(updated));
    } catch {}
    const bootcamp = bootcamps.find(b => b.id === bootcampId);
    showToast(
      `🎟️ 1-Time Free Pass Claimed!`,
      `Enrolled in "${bootcamp?.title || 'Transition Sprint'}". Live access link & blueprint sent to your email. (1-Time Free Benefit Used)`,
      'success'
    );
  };

  const [namedExpertInvite] = useState<NamedExpertInvite>(defaultNamedExpertInvite);

  // Search & Global Toasts & Selected Job Category & Peerpath Context
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('all');
  const [peerpathJobContext, setPeerpathJobContext] = useState<PeerpathJobContext | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const clearPeerpathJobContext = () => {
    setPeerpathJobContext(null);
  };

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Mentor Follow System
  const [followedMentorIds, setFollowedMentorIds] = useState<string[]>(['saheli']);

  const isFollowingMentor = (mentorId: string) => {
    return followedMentorIds.includes(mentorId);
  };

  const toggleFollowMentor = (mentorId: string, mentorName?: string) => {
    const isCurrentlyFollowing = followedMentorIds.includes(mentorId);
    if (isCurrentlyFollowing) {
      setFollowedMentorIds(prev => prev.filter(id => id !== mentorId));
      showToast('Unfollowed Mentor', `You will no longer receive priority slot alerts for ${mentorName || 'this mentor'}.`, 'info');
    } else {
      setFollowedMentorIds(prev => [...prev, mentorId]);
      showToast(`🔔 Followed ${mentorName || 'Mentor'}!`, `You will get instant WhatsApp alerts whenever new 1:1 mentorship slots or group AMAs open.`, 'success');
    }
  };

  // Community & Mentor Insights System
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [notifications, setNotifications] = useState<CommunityNotification[]>(INITIAL_NOTIFICATIONS);

  const createMentorPost = (postData: { title: string; content: string; tags: string[] }) => {
    const isMentor = currentUser?.role === 'mentor' || isCreatorMode;
    if (!isMentor || !currentUser) {
      showToast('Mentor Access Required', 'Only verified mentors can publish insights in Community.', 'warning');
      return null;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      mentorId: currentUser.id || 'mentor',
      mentorName: currentUser.name,
      mentorRole: currentUser.headline || (isCreatorMode ? 'Verified Tech Lead & Mentor' : 'Mentor'),
      mentorCompany: currentUser.company || 'Shine Peerpath',
      mentorAvatar: currentUser.avatar || '/avatars/akash.jpg',
      title: postData.title,
      content: postData.content,
      tags: postData.tags.length > 0 ? postData.tags : ['Career Guidance', 'Tech Transition'],
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      comments: [],
      analytics: {
        impressions: 48,
        reach: 36,
        engagements: 2,
        engagementRate: '4.2%',
        reactionsBreakdown: { likes: 0, hearts: 0, insightful: 0 },
        commentsCount: 0,
        repliesCount: 0,
        sharesCount: 0,
        profileClicks: 4,
        bookingsGenerated: 0,
        revenueGenerated: 0,
        topAudienceTitles: [
          { title: 'Senior Software Engineer', percentage: 50 },
          { title: 'Product Manager', percentage: 30 },
          { title: 'Tech Lead', percentage: 20 }
        ],
        topAudienceCompanies: [
          { company: 'Swiggy', percentage: 40 },
          { company: 'Amazon', percentage: 35 },
          { company: 'Razorpay', percentage: 25 }
        ],
        topLocations: [
          { city: 'Bengaluru', percentage: 65 },
          { city: 'Delhi NCR', percentage: 35 }
        ]
      }
    };

    setCommunityPosts(prev => [newPost, ...prev]);

    // Create notification for followers
    const newNotif: CommunityNotification = {
      id: `notif-${Date.now()}`,
      type: 'mentor_post',
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      mentorAvatar: currentUser.avatar || '/avatars/akash.jpg',
      postId: newPost.id,
      title: 'New Post Published',
      message: `${currentUser.name} published a new insight: "${postData.title}"`,
      createdAt: 'Just now',
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast('🎉 Post Published!', 'Your insight is live on the Community feed. All candidates following you have been notified.', 'success');
    return newPost;
  };

  const addPostComment = (postId: string, content: string) => {
    if (!currentUser) {
      showToast('Sign in required', 'Please sign in to join the discussion.', 'info');
      setIsLoginModalOpen(true);
      return null;
    }

    const isMentor = currentUser.role === 'mentor' || isCreatorMode;
    const newComment: CommunityComment = {
      id: `c-${Date.now()}`,
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.headline || (isMentor ? 'Verified Mentor' : 'Candidate'),
      authorAvatar: currentUser.avatar || (isMentor ? '/avatars/akash.jpg' : '/avatars/prakash.jpg'),
      authorIsMentor: isMentor,
      content: content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      likedByCurrentUser: false
    };

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    showToast('💬 Comment Added', 'Your response has been posted to the mentor discussion thread.', 'success');
    return newComment;
  };

  const togglePostLike = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByCurrentUser;
        return {
          ...p,
          likedByCurrentUser: liked,
          likesCount: liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const toggleCommentLike = (postId: string, commentId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const liked = !c.likedByCurrentUser;
              return {
                ...c,
                likedByCurrentUser: liked,
                likesCount: liked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All caught up!', 'All notifications marked as read.', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // View Navigation with URL sync & Smooth Scroll
  const navigate = (view: ViewType, customPath?: string) => {
    setPreviousView(currentView);
    setCurrentView(view);

    const routeMap: Record<ViewType, string> = {
      'guidance-view': '/peerpath',
      'experts-view': '/experts',
      'expert-profile-view': selectedExpert ? `/expert/${selectedExpert.id}` : '/experts',
      'payment-view': '/checkout',
      'confirmed-view': '/confirmed',
      'sessions-view': '/sessions',
      'dashboard-view': '/dashboard',
      'profile-view': '/profile',
      'live-call-view': '/room/peerpath-session',
      'post-session-view': '/session/feedback',
      'recruiter-view': '/recruiter',
      'jobs-view': '/jobs',
      'login-view': '/pages/myshine/login',
      'mentor-dashboard-view': '/creator-studio',
      'community-view': '/community'
    };

    let pathToPush = customPath;
    if (!pathToPush) {
      if (view === 'expert-profile-view' && (window.location.pathname.startsWith('/expert/') || window.location.pathname.startsWith('/mentor/'))) {
        pathToPush = window.location.pathname;
      } else {
        pathToPush = routeMap[view] || '/peerpath';
      }
    }

    if (window.location.pathname !== pathToPush) {
      window.history.pushState({}, '', pathToPush);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authentication methods
  // Completes login once we have a resolved { account, profile } pair, regardless of
  // whether it came from the hardcoded DEFAULT_ACCOUNTS or a fetched backend candidate.
  const completeLogin = (cleanUser: string, account: UserAccount, profile: UserProfileData) => {
    setCurrentUser(account);
    setUserProfiles(prev => ({
      ...prev,
      [cleanUser]: { ...profile, ...(prev[cleanUser] || {}) }
    }));
    setIsLoginModalOpen(false);
    const isMentorRole = account.role === 'mentor' || Boolean(profile.isMentor);
    setIsCreatorMode(isMentorRole);

    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect');
    const utmSource = urlParams.get('utm_source');
    const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign');

    if (redirectParam) {
      navigate('guidance-view', redirectParam);
    } else if (isMentorRole && !utmSource && !campaign) {
      navigate('mentor-dashboard-view', '/creator-studio');
    } else {
      // Always redirect candidate logins and campaign traffic (WhatsApp/Email) directly to Peerpath!
      navigate('guidance-view', '/peerpath');
    }

    const campaignLabel = utmSource ? ` [${utmSource.toUpperCase()} Campaign]` : '';
    showToast(`👋 Welcome, ${account.name}!`, `Logged in successfully • Redirected to Shine Peerpath${campaignLabel}.`);
  };

  // Any of the 50 seeded candidates (across AI/ML, Semiconductor, Cybersecurity, Full-Stack)
  // can sign in with this shared demo password + their candidate id/email from db.json —
  // there's no per-candidate password since these are demo records, not real accounts.
  const SHARED_DEMO_PASSWORD = 'shine@123';

  const buildAccountFromBackendCandidate = (raw: any): { account: UserAccount; profile: UserProfileData } => {
    const account: UserAccount = {
      id: raw.id,
      username: raw.id,
      name: raw.name,
      role: 'candidate',
      avatar: `https://i.pravatar.cc/150?u=${raw.id}`,
      email: raw.email,
      headline: raw.headline,
      company: raw.pastCompany,
      experienceYears: raw.experienceYears,
      location: raw.location,
      hasExpertBadge: false,
      isMentorEligible: false
    };
    const profile: UserProfileData = {
      name: raw.name,
      headline: raw.headline,
      experienceYears: raw.experienceYears,
      location: raw.location,
      profileScore: raw.profileScore,
      jobSearchStatus: raw.jobSearchStatus,
      summary: raw.summary,
      skills: raw.skills || [],
      badges: raw.badges || [],
      email: raw.email,
      phone: raw.phone,
      currentCtc: raw.currentCtc,
      targetCtc: raw.targetCtc,
      targetRole: raw.targetRole,
      targetCompany: raw.targetCompany,
      educationDegree: raw.educationDegree,
      educationCollege: raw.educationCollege,
      pastCompany: raw.pastCompany,
      pastCompanyRole: raw.pastCompanyRole,
      currentCompany: raw.pastCompany,
      dreamCompany: raw.targetCompany,
      isCalibrated: true
    };
    return { account, profile };
  };

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();
    const entry = DEFAULT_ACCOUNTS[cleanUser];

    if (entry && entry.password === cleanPassword) {
      completeLogin(cleanUser, entry.account, entry.profile);
      return true;
    }

    // Fall back to any of the 50 seeded candidates in db.json (id or email), all sharing
    // the same demo password since these are dummy records rather than real signups.
    if (!entry && cleanPassword === SHARED_DEMO_PASSWORD && cleanUser) {
      try {
        const raw = await peerpathApi.getCandidateProfile(cleanUser);
        if (raw && (raw as any).id) {
          const { account, profile } = buildAccountFromBackendCandidate(raw);
          completeLogin(cleanUser, account, profile);
          return true;
        }
      } catch (err) {
        // Not a known candidate id — fall through to the invalid-credentials toast below.
      }
    }

    showToast('Invalid Credentials', 'Please check username or password (shine@123)', 'warning');
    return false;
  };

  const switchUser = (targetUsername: string) => {
    const cleanUser = targetUsername.trim().toLowerCase();
    const entry = DEFAULT_ACCOUNTS[cleanUser];
    if (entry) {
      setCurrentUser(entry.account);
      setUserProfiles(prev => ({
        ...prev,
        [cleanUser]: { ...entry.profile, ...(prev[cleanUser] || {}) }
      }));
      const isMentorRole = entry.account.role === 'mentor' || Boolean(entry.profile.isMentor);
      setIsCreatorMode(isMentorRole);
      
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');

      if (redirectParam) {
        navigate('guidance-view', redirectParam);
      } else if (isMentorRole) {
        navigate('mentor-dashboard-view', '/creator-studio');
      } else {
        // Redirect directly to Peerpath page
        navigate('guidance-view', '/peerpath');
      }
      showToast(`⚡ Logged in as ${entry.account.name}`, `Redirected to Shine Peerpath.`);
    }
  };

  const resetDemoData = (targetUsername?: string) => {
    try {
      localStorage.removeItem('shine_peerpath_current_user');
      localStorage.removeItem('shine_peerpath_experts');
      localStorage.removeItem('shine_peerpath_sessions');
      localStorage.removeItem('shine_peerpath_profiles_db');
    } catch (e) {
      console.warn('LocalStorage clear error', e);
    }

    const freshProfiles: Record<string, UserProfileData> = {
      prakash: JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS.prakash.profile)),
      akash: JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS.akash.profile)),
      nisha: JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS.nisha.profile))
    };

    const freshSessions = JSON.parse(JSON.stringify(initialSessions));

    peerpathApi.getCreators().then(c => {
      if (c && c.length > 0) setExperts(c);
    }).catch(() => {});

    setSessions(freshSessions);
    setUserProfiles(freshProfiles);

    const target = targetUsername || currentUser?.username || 'prakash';
    const userToSet = DEFAULT_ACCOUNTS[target]?.account || DEFAULT_ACCOUNTS.prakash.account;
    setCurrentUser(userToSet);

    try {
      localStorage.setItem('shine_peerpath_current_user', JSON.stringify(userToSet));
      localStorage.setItem('shine_peerpath_sessions', JSON.stringify(freshSessions));
      localStorage.setItem('shine_peerpath_profiles_db', JSON.stringify(freshProfiles));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }

    peerpathApi.resetDemo().catch(err => console.warn('[API resetDemo]:', err));

    navigate('dashboard-view');
    showToast('🔄 Demo Data Reset Complete', `All 3 personas (Prakash: Candidate, Nisha: Pitch, Akash: Mentor) restored to pristine state.`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(false);
    navigate('login-view', '/pages/myshine/login');
    showToast('Signed Out', 'You have been safely signed out of your Shine account.', 'info');
  };

  const selectExpertById = (expertId: string) => {
    const cleanId = (expertId || '').trim().toLowerCase();
    const found = experts.find(e => e.id.toLowerCase() === cleanId);
    if (found) {
      setSelectedExpert(found);
      setBookingDraft(prev => ({ ...prev, expert: found }));
    } else {
      peerpathApi.getCreatorById(cleanId).then(creator => {
        if (creator) {
          setSelectedExpert(creator);
          setBookingDraft(prev => ({ ...prev, expert: creator }));
        }
      }).catch(err => console.warn('[selectExpertById]:', err));
    }
  };

  const addExpert = (newExpertData: Omit<Expert, 'id'>): Expert => {
    const id = 'exp-' + Date.now();
    const fullExpert: Expert = { ...newExpertData, id };
    setExperts(prev => [fullExpert, ...prev]);

    // Asynchronously publish to backend API store
    peerpathApi.registerCreator(fullExpert).catch(err => console.warn('[API registerCreator]:', err));

    return fullExpert;
  };

  // Sessions Management
  const bookSession = (expert: Expert, date: string, timeSlot: string): MentorshipSession => {
    const newSession: MentorshipSession = {
      id: 'sess-' + Date.now(),
      expert,
      candidateName: userProfile.name || 'Prakash Mahto',
      candidateRole: userProfile.headline?.split('|')[0]?.trim() || 'Senior Frontend Engineer',
      candidateAvatar: '/avatars/prakash.jpg',
      candidateGoal: `Career Guidance & Transition Strategy into ${expert.company}`,
      date,
      timeSlot,
      status: 'upcoming',
      meetingLink: `https://meet.shine.com/room/peerpath-${expert.id}-${Date.now().toString().slice(-4)}`
    };

    setSessions(prev => [newSession, ...prev]);

    // Post to backend API
    peerpathApi.checkoutAndBookSession({
      expertId: expert.id,
      candidateName: newSession.candidateName,
      candidateRole: newSession.candidateRole,
      date,
      timeSlot,
      paymentMethod: 'upi',
      amount: expert.price || 999
    }).catch(err => console.warn('[API checkout]:', err));

    showToast('🎉 Session Booked Successfully!', `Meeting scheduled with ${expert.name} on ${date}.`);
    return newSession;
  };

  const cancelSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session Cancelled', 'Your mentorship booking has been removed.', 'info');
  };

  const rescheduleSession = (sessionId: string, newDate: string, newTimeSlot: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, date: newDate, timeSlot: newTimeSlot };
      }
      return s;
    }));
    showToast('Session Rescheduled', `Updated to ${newDate} (${newTimeSlot}).`);
  };

  const completeSession = (sessionId: string, rating: number, notes: string, badgeTitle?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          status: 'completed',
          rating,
          feedbackNotes: notes,
          badgeAwarded: badgeTitle
        };
      }
      return s;
    }));

    // Post rubric & badge to backend assessment API
    peerpathApi.submitAssessment(sessionId, {
      badgeTitle: badgeTitle || 'Peer-Verified Skill Badge',
      feedbackNotes: notes,
      rating,
      skillsVerified: ['System Architecture', 'Problem Solving']
    }).catch(err => console.warn('[API submitAssessment]:', err));

    showToast('🎉 Assessment Complete!', 'Skill badge and feedback updated on your profile.');
  };

  // Fire-and-forget: persists candidate edits to server/data/db.json via PUT /api/candidates/:id.
  // Swallows errors (e.g. mentor-only accounts with no backend candidate record) so the
  // optimistic local UI update above never blocks on this.
  const syncCandidateProfile = (candidateId: string, updates: Partial<UserProfileData>) => {
    peerpathApi.updateCandidateProfile(candidateId, updates).catch(err => console.warn('[API updateCandidateProfile]:', err));
  };

  const updateUserProfile = (updates: Partial<UserProfileData>) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      return {
        ...prev,
        [activeUsername]: { ...existing, ...updates }
      };
    });
    syncCandidateProfile(activeUsername, updates);
    showToast('Profile Updated', 'Your profile details have been saved.');
  };

  const updateProfileSummary = (summary: string) => {
    let nextProfileScore = 0;
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      nextProfileScore = Math.min(100, existing.profileScore + 5);
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          summary,
          profileScore: nextProfileScore
        }
      };
    });
    syncCandidateProfile(activeUsername, { summary, profileScore: nextProfileScore });
    showToast('Summary Boosted (+5%)', 'Your profile strength is now higher for recruiters!');
  };

  const addSkill = (skill: string) => {
    let nextSkills: string[] | null = null;
    let nextProfileScore = 0;
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      if (!existing.skills.includes(skill)) {
        nextSkills = [...existing.skills, skill];
        nextProfileScore = Math.min(100, existing.profileScore + 2);
        return {
          ...prev,
          [activeUsername]: {
            ...existing,
            skills: nextSkills,
            profileScore: nextProfileScore
          }
        };
      }
      return prev;
    });
    if (nextSkills) syncCandidateProfile(activeUsername, { skills: nextSkills, profileScore: nextProfileScore });
    showToast('Skill Added', `${skill} added to your verified profile.`);
  };

  const removeSkill = (skill: string) => {
    let nextSkills: string[] = [];
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      nextSkills = existing.skills.filter(s => s !== skill);
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          skills: nextSkills
        }
      };
    });
    syncCandidateProfile(activeUsername, { skills: nextSkills });
    showToast('Skill Removed', `${skill} removed from profile.`, 'info');
  };

  const awardBadge = (newBadge: PeerVerifiedBadge) => {
    let nextBadges: PeerVerifiedBadge[] = [];
    let nextProfileScore = 0;
    const targetUser = 'prakash';
    setUserProfiles(prev => {
      const existing = prev[targetUser] || DEFAULT_ACCOUNTS.prakash.profile;
      nextBadges = [newBadge, ...existing.badges.filter(b => b.title !== newBadge.title)];
      nextProfileScore = Math.min(100, existing.profileScore + 8);
      return {
        ...prev,
        [targetUser]: {
          ...existing,
          badges: nextBadges,
          profileScore: nextProfileScore
        }
      };
    });
    syncCandidateProfile(targetUser, { badges: nextBadges, profileScore: nextProfileScore });
  };

  const updateJobSearchStatus = (status: string) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.prakash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          jobSearchStatus: status
        }
      };
    });
    syncCandidateProfile(activeUsername, { jobSearchStatus: status });
    showToast('Job Status Updated', `Status changed to "${status}".`);
  };

  const updateMentorAvailability = (days: string[], timeSlots: string[]) => {
    setMentorAvailability({ days, timeSlots });
    showToast('Availability Saved', 'Your weekly mentorship slots have been updated.');
  };

  const updateMentorRatesAndAvailability = (rate: number, duration: number, days: string[], timeSlots: string[]) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.akash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          mentorRate: rate,
          mentorDuration: duration,
          mentorAvailability: { days, timeSlots }
        }
      };
    });
    setMentorAvailability({ days, timeSlots });
    showToast('Mentorship Settings Saved', `Session fee set to ₹${rate} & schedule updated!`);
  };

  const updateMentorTeaserVideo = (teaser: { url: string; title: string; duration?: string; thumbnail?: string; uploadedAt?: string } | null) => {
    setUserProfiles(prev => {
      const existing = prev[activeUsername] || DEFAULT_ACCOUNTS[activeUsername]?.profile || DEFAULT_ACCOUNTS.akash.profile;
      return {
        ...prev,
        [activeUsername]: {
          ...existing,
          mentorTeaserVideo: teaser
        }
      };
    });
    showToast(teaser ? '🎉 Teaser Video Published!' : 'Teaser Video Removed', teaser ? 'Candidates can now watch your introduction on Peerpath.' : undefined);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        previousView,
        navigate,
        currentUser,
        isLoggedIn,
        login,
        logout,
        switchUser,
        resetDemoData,
        experts,
        selectedExpert,
        setSelectedExpert,
        selectExpertById,
        addExpert,
        sessions,
        activeSession,
        setActiveSession,
        bookSession,
        cancelSession,
        rescheduleSession,
        completeSession,
        userProfile,
        updateUserProfile,
        updateProfileSummary,
        addSkill,
        removeSkill,
        awardBadge,
        updateJobSearchStatus,
        mentorAvailability,
        updateMentorAvailability,
        updateMentorRatesAndAvailability,
        updateMentorTeaserVideo,
        isCreatorMode,
        setIsCreatorMode,
        toggleCreatorMode,
        creatorActiveTab,
        setCreatorActiveTab,
        navigateToCreatorStudio,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isCreatorWizardOpen,
        setIsCreatorWizardOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAssessmentModalOpen,
        setIsAssessmentModalOpen,
        isCvSyncModalOpen,
        setIsCvSyncModalOpen,
        updateCandidateResume,
        removeCandidateResume,
        assessmentDraftSession,
        setAssessmentDraftSession,
        bookingDraft,
        setBookingDraft,
        isCalibrationModalOpen,
        setIsCalibrationModalOpen,
        calibrateCandidateProfile,
        bootcamps,
        registeredBootcampIds,
        registerForBootcamp,
        namedExpertInvite,
        searchQuery,
        setSearchQuery,
        selectedJobCategory,
        setSelectedJobCategory,
        peerpathJobContext,
        setPeerpathJobContext,
        clearPeerpathJobContext,
        toasts,
        showToast,
        removeToast,
        followedMentorIds,
        toggleFollowMentor,
        isFollowingMentor,
        communityPosts,
        createMentorPost,
        addPostComment,
        togglePostLike,
        toggleCommentLike,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
