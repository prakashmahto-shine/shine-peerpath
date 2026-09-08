export type DomainVertical = 'AI/ML' | 'Semiconductor' | 'Cybersecurity' | 'Full-Stack' | 'Product Management' | 'Search & Data Infra' | 'SaaS Sales';

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
  pastCompany?: string;
  pastCompanyRole?: string;
  educationDegree?: string;
  educationCollege?: string;
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
}

export interface TrajectoryMatch {
  creator: Creator;
  trajectorySimilarityScore: number;
  jumpDelta: string;
  matchReasons: string[];
  criticalBoosterSkills: string[];
  suggestedSessionGoal: string;
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
