import { store } from '../data/store';
import { CandidateProfile } from '../types';

export class RecruiterService {
  /**
   * Recruiter Search in Thin-Pool Domains:
   * Provides recruiter filtering across AI/ML, Semiconductor, Cybersecurity, and Full-Stack.
   * Enables the `peer_verified_only` filter to skip GenAI-decorated resumes and surface candidates
   * evaluated by working peers at Tier-1 companies.
   */
  public searchCandidates(options: {
    domain?: string;
    query?: string;
    peerVerifiedOnly?: boolean;
    minScore?: number;
  }): {
    totalMatches: number;
    peerVerifiedCount: number;
    candidates: (CandidateProfile & {
      matchScore: number;
      topBadge?: CandidateProfile['badges'][0];
    })[];
  } {
    let list = store.getCandidates(options.domain, options.peerVerifiedOnly);

    if (options.query && options.query.trim()) {
      const q = options.query.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (options.minScore) {
      list = list.filter(c => c.profileScore >= (options.minScore || 0));
    }

    const enhanced = list.map(c => {
      const hasBadges = c.badges && c.badges.length > 0;
      const baseMatch = hasBadges ? 96 : 82;
      return {
        ...c,
        matchScore: baseMatch,
        topBadge: hasBadges ? c.badges[0] : undefined
      };
    });

    return {
      totalMatches: enhanced.length,
      peerVerifiedCount: enhanced.filter(c => c.badges && c.badges.length > 0).length,
      candidates: enhanced
    };
  }

  public sendInterviewInvite(candidateId: string, recruiterInfo: {
    recruiterName: string;
    company: string;
    roleTitle: string;
    message?: string;
  }) {
    const candidate = store.getCandidate(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    return {
      success: true,
      inviteId: 'inv_' + Date.now().toString(36),
      candidateName: candidate.name,
      recruiterCompany: recruiterInfo.company,
      roleTitle: recruiterInfo.roleTitle,
      sentAt: new Date().toISOString(),
      status: 'INVITATION_DELIVERED',
      note: `Interview invitation sent to ${candidate.name} with verified candidate badge highlight.`
    };
  }
}

export const recruiterService = new RecruiterService();
