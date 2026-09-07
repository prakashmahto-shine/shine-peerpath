import { Expert, MentorshipSession, PeerVerifiedBadge, TrajectoryMatch, ZeroPrepDossier } from '../types';

const API_BASE = '/api';

export const peerpathApi = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  // Creators
  async getCreators(domain?: string, query?: string): Promise<Expert[]> {
    const params = new URLSearchParams();
    if (domain && domain !== 'all') params.append('domain', domain);
    if (query) params.append('q', query);
    
    const res = await fetch(`${API_BASE}/creators?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed fetching creators: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCreatorById(id: string): Promise<Expert> {
    const res = await fetch(`${API_BASE}/creators/${id}`);
    if (!res.ok) throw new Error(`Failed fetching creator ${id}`);
    const json = await res.json();
    return json.data;
  },

  async registerCreator(creatorData: Partial<Expert>): Promise<Expert> {
    const res = await fetch(`${API_BASE}/creators/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creatorData)
    });
    if (!res.ok) throw new Error(`Failed registering creator`);
    const json = await res.json();
    return json.data;
  },

  // Trajectory Matching
  async matchTrajectories(params: {
    currentRole: string;
    currentExperience?: string;
    currentSalary?: string;
    targetRole?: string;
    targetPackage?: string;
    domain?: string;
    skills: string[];
  }): Promise<TrajectoryMatch[]> {
    const res = await fetch(`${API_BASE}/trajectory/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`Failed matching trajectories`);
    const json = await res.json();
    return json.data;
  },

  // CV Gap Analysis
  async runGapAnalysis(params: {
    domain?: string;
    skills?: string[];
    currentRole?: string;
    currentCtc?: string;
  }) {
    const res = await fetch(`${API_BASE}/cv/gap-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error(`Failed running gap analysis`);
    const json = await res.json();
    return json.data;
  },

  // Bookings & Mock Checkout
  async getSessions(userId?: string, role?: 'candidate' | 'mentor'): Promise<MentorshipSession[]> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (role) params.append('role', role);

    const res = await fetch(`${API_BASE}/bookings?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed fetching sessions`);
    const json = await res.json();
    return json.data;
  },

  async checkoutAndBookSession(payload: {
    expertId: string;
    candidateId?: string;
    candidateName?: string;
    candidateRole?: string;
    candidateAvatar?: string;
    candidateGoal?: string;
    candidateEmail?: string;
    date: string;
    timeSlot: string;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
    upiId?: string;
    amount: number;
  }): Promise<{ session: MentorshipSession; receipt: any }> {
    const res = await fetch(`${API_BASE}/payments/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed processing checkout`);
    const json = await res.json();
    return json;
  },

  async cancelSession(sessionId: string): Promise<MentorshipSession> {
    const res = await fetch(`${API_BASE}/bookings/${sessionId}/cancel`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed cancelling session`);
    const json = await res.json();
    return json.data;
  },

  async rescheduleSession(sessionId: string, newDate: string, newTimeSlot: string): Promise<MentorshipSession> {
    const res = await fetch(`${API_BASE}/bookings/${sessionId}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDate, newTimeSlot })
    });
    if (!res.ok) throw new Error(`Failed rescheduling session`);
    const json = await res.json();
    return json.data;
  },

  // Creator Mode Zero-Prep Dossier
  async getZeroPrepDossier(sessionId: string): Promise<ZeroPrepDossier> {
    const res = await fetch(`${API_BASE}/creator/sessions/${sessionId}/briefing`);
    if (!res.ok) throw new Error(`Failed fetching zero-prep dossier`);
    const json = await res.json();
    return json.data;
  },

  // Assessment & Peer Badge Issuance
  async submitAssessment(sessionId: string, payload: {
    rating: number;
    feedbackNotes: string;
    badgeTitle?: string;
    skillsVerified?: string[];
    interviewReadinessScore?: number;
  }): Promise<{ session: MentorshipSession; badge: PeerVerifiedBadge; recruiterVisibilityBoost: string }> {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed submitting assessment`);
    const json = await res.json();
    return json.data;
  },

  // Recruiter Search
  async searchRecruiterCandidates(params?: {
    domain?: string;
    query?: string;
    peerVerifiedOnly?: boolean;
    minScore?: number;
  }) {
    const qs = new URLSearchParams();
    if (params?.domain && params.domain !== 'all') qs.append('domain', params.domain);
    if (params?.query) qs.append('q', params.query);
    if (params?.peerVerifiedOnly) qs.append('peer_verified_only', 'true');
    if (params?.minScore) qs.append('min_score', String(params.minScore));

    const res = await fetch(`${API_BASE}/recruiter/candidates?${qs.toString()}`);
    if (!res.ok) throw new Error(`Failed searching recruiter candidates`);
    const json = await res.json();
    return json.data;
  },

  async sendRecruiterInvite(payload: {
    candidateId: string;
    recruiterName?: string;
    company: string;
    roleTitle: string;
    message?: string;
  }) {
    const res = await fetch(`${API_BASE}/recruiter/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Failed sending interview invite`);
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/metrics`);
    if (!res.ok) throw new Error(`Failed fetching analytics`);
    return res.json();
  },

  // Reset Demo
  async resetDemo() {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    if (!res.ok) throw new Error(`Failed resetting demo`);
    return res.json();
  }
};
