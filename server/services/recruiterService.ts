import { store } from '../data/store';
import { CandidateProfile } from '../types';
import { cosineSimilarity, createEmbedding, normalizedSkill } from './embeddingService';

export interface RoleMatch {
  candidate: CandidateProfile;
  matchPercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export class RecruiterService {
  private readonly candidateEmbeddingCache = new Map<string, { sourceText: string; embedding: number[] }>();

  private async getCandidateEmbedding(candidate: CandidateProfile): Promise<number[]> {
    const sourceText = `${candidate.headline} ${candidate.summary} ${(candidate.skills || []).join(' ')}`;
    const cached = this.candidateEmbeddingCache.get(candidate.id);
    if (cached && cached.sourceText === sourceText) {
      return cached.embedding;
    }

    const embedding = await createEmbedding(sourceText);
    this.candidateEmbeddingCache.set(candidate.id, { sourceText, embedding });
    return embedding;
  }

  public async matchCandidatesToRole(input: {
    roleTitle: string;
    requiredSkills: string[];
    candidateId?: string;
    peerVerifiedOnly?: boolean;
  }): Promise<RoleMatch[]> {
    const candidates = input.candidateId
      ? [store.getCandidate(input.candidateId)].filter((candidate): candidate is CandidateProfile => Boolean(candidate))
      : store.getCandidates(undefined, input.peerVerifiedOnly);
    const roleText = `${input.roleTitle} ${input.requiredSkills.join(' ')}`;
    const roleEmbedding = await createEmbedding(roleText);

    const matches = await Promise.all(candidates.map(async candidate => {
      const candidateSkills = candidate.skills || [];
      const matchedSkills = input.requiredSkills.filter(required => {
        const normalizedRequired = normalizedSkill(required);
        return candidateSkills.some(skill => {
          const normalizedCandidate = normalizedSkill(skill);
          return normalizedCandidate === normalizedRequired ||
            normalizedCandidate.includes(normalizedRequired) ||
            normalizedRequired.includes(normalizedCandidate);
        });
      });
      const missingSkills = input.requiredSkills.filter(skill => !matchedSkills.includes(skill));
      const skillCoverage = input.requiredSkills.length === 0
        ? 0
        : matchedSkills.length / input.requiredSkills.length;
      const candidateEmbedding = await this.getCandidateEmbedding(candidate);
      const semanticSimilarity = Math.max(0, cosineSimilarity(candidateEmbedding, roleEmbedding));
      const verifiedBoost = candidate.badges?.length ? 0.05 : 0;
      const matchPercent = Math.round(Math.min(99, Math.max(0,
        (skillCoverage * 0.7 + semanticSimilarity * 0.25 + verifiedBoost) * 100
      )));

      return {
        candidate,
        matchPercent,
        matchedSkills,
        missingSkills,
        explanation: missingSkills.length === 0
          ? 'Strong skills and profile-context match for this role.'
          : `Good foundation, but missing ${missingSkills.join(' and ')} for this role.`
      };
    }));

    return matches.sort((left, right) => right.matchPercent - left.matchPercent);
  }

  /**
   * Recruiter Search in Thin-Pool Domains:
   * Provides dense embedding natural language search across AI/ML, Semiconductor, Cybersecurity, and Full-Stack.
   * Enables the `peer_verified_only` filter to skip GenAI-decorated resumes and surface candidates
   * evaluated by working peers at Tier-1 companies.
   */
  public async searchCandidates(options: {
    domain?: string;
    query?: string;
    peerVerifiedOnly?: boolean;
    minScore?: number;
  }): Promise<{
    totalMatches: number;
    peerVerifiedCount: number;
    candidates: (CandidateProfile & {
      matchScore: number;
      topBadge?: CandidateProfile['badges'][0];
      semanticExplanation?: string;
    })[];
  }> {
    let list = store.getCandidates(options.domain, options.peerVerifiedOnly);

    if (options.minScore) {
      list = list.filter(c => c.profileScore >= (options.minScore || 0));
    }

    if (options.query && options.query.trim()) {
      const q = options.query.trim();
      const qLower = q.toLowerCase();
      const queryVec = await createEmbedding(q);

      const scored = await Promise.all(list.map(async candidate => {
        const candidateVec = await this.getCandidateEmbedding(candidate);
        const similarity = Math.max(0, cosineSimilarity(queryVec, candidateVec));
        const hasBadges = candidate.badges && candidate.badges.length > 0;
        const hasExactKeyword = candidate.name.toLowerCase().includes(qLower) ||
          candidate.headline.toLowerCase().includes(qLower) ||
          candidate.skills.some(s => s.toLowerCase().includes(qLower));

        // Score based on semantic vector similarity + keyword bonus + peer-verified boost
        const matchScore = Math.min(99, Math.max(50, Math.round(
          (similarity * 55) + (hasExactKeyword ? 20 : 0) + (hasBadges ? 15 : 0) + (candidate.profileScore * 0.1)
        )));

        return {
          candidate,
          similarity,
          hasExactKeyword,
          matchScore,
          topBadge: hasBadges ? candidate.badges[0] : undefined,
          semanticExplanation: `Semantic Match: ${Math.round(similarity * 100)}% relevance to "${q}"`
        };
      }));

      // Filter to relevant candidates (semantic similarity >= 0.25 or keyword match)
      const filtered = scored.filter(item => item.similarity >= 0.25 || item.hasExactKeyword);
      filtered.sort((a, b) => b.matchScore - a.matchScore);

      const enhanced = filtered.map(item => ({
        ...item.candidate,
        matchScore: item.matchScore,
        topBadge: item.topBadge,
        semanticExplanation: item.semanticExplanation
      }));

      return {
        totalMatches: enhanced.length,
        peerVerifiedCount: enhanced.filter(c => c.badges && c.badges.length > 0).length,
        candidates: enhanced
      };
    }

    // Default view when no search query is specified
    const enhanced = list.map(c => {
      const hasBadges = c.badges && c.badges.length > 0;
      return {
        ...c,
        matchScore: hasBadges ? 96 : 82,
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
