import { store } from '../data/store';
import { PeerVerifiedBadge, ZeroPrepDossier, MentorshipSession } from '../types';

export class AssessmentService {
  /**
   * Zero-Prep Dossier:
   * Solves the key Topmate pain point: mentors spend 30-45 mins preparing for calls.
   * On Peerpath, all mentee context, gap analysis, and rubric prompts are pre-loaded.
   */
  public getZeroPrepDossier(sessionId: string): ZeroPrepDossier {
    const session = store.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session with id "${sessionId}" not found`);
    }

    const candidate = store.getCandidate(session.candidateId) || {
      id: session.candidateId,
      name: session.candidateName,
      headline: session.candidateRole,
      experienceYears: '4+ Years',
      currentCtc: '₹7.5 LPA',
      targetCtc: '₹22 - 30 LPA',
      targetRole: `Staff Engineer @ ${session.expert.company}`,
      skills: ['React.js', 'TypeScript', 'Next.js', 'System Design'],
      summary: 'Candidate actively seeking 1:1 guidance to make the jump from mid-tier to Tier-1 product tech.',
      badges: [],
      email: session.candidateEmail || 'candidate@shine.com',
      phone: '+91 98765 43210',
      profileScore: 78,
      jobSearchStatus: 'Serving Notice Period'
    };

    const expertSkills = session.expert.skills;

    return {
      sessionId: session.id,
      candidate: {
        name: candidate.name,
        headline: candidate.headline,
        experienceYears: candidate.experienceYears,
        currentCtc: candidate.currentCtc,
        targetCtc: candidate.targetCtc,
        targetRole: candidate.targetRole || `Role at ${session.expert.company}`,
        skills: candidate.skills,
        summary: candidate.summary
      },
      gapReport: {
        missingSkills: session.expert.trajectory.keyJumpSkills,
        targetJump: `Jump to ${candidate.targetCtc || '₹22L+'}`,
        suggestedFocusAreas: [
          `Review candidate's architectural grasp of ${expertSkills[0]} and ${expertSkills[1]}`,
          `Simulate Tier-1 interview loop for ${session.expert.role}`,
          `Provide direct feedback on resume bullets and metric storytelling`
        ]
      },
      recommendedAssessmentRubric: [
        {
          category: 'Architectural Depth',
          criteria: [
            'Understanding of concurrency and distributed performance',
            'Familiarity with production trade-offs and edge cases',
            'Clean code and design pattern modularity'
          ]
        },
        {
          category: 'Communication & Problem Solving',
          criteria: [
            'Structuring answers with STAR / Framework method',
            'Clarity under hypothetical failure scenarios',
            'Readiness for Tier-1 engineering discussions'
          ]
        }
      ],
      quickDiscussionPrompts: [
        `"Walk me through how you would architect a resilient system for ${session.expert.domain}."`,
        `"What is the single biggest bottleneck you solved in your current job?"`,
        `"How do you approach latency optimization vs feature velocity?"`
      ]
    };
  }

  /**
   * Submit mentor assessment:
   * 1. Awards Peer-Verified Skill Badge signed by mentor.
   * 2. Updates candidate Shine profile.
   * 3. Boosts recruiter search multiplier.
   * 4. Marks session as completed.
   */
  public submitAssessment(sessionId: string, payload: {
    rating: number;
    feedbackNotes: string;
    badgeTitle?: string;
    skillsVerified: string[];
    interviewReadinessScore?: number;
  }): {
    session: MentorshipSession;
    badge: PeerVerifiedBadge;
    candidateProfileScore: number;
    recruiterVisibilityBoost: string;
  } {
    const session = store.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const badgeTitle = payload.badgeTitle || `${session.expert.domain} Competency Verified`;
    const hash = `SHINE-PEER-${Date.now().toString(36).toUpperCase()}-${session.expert.company.substring(0, 3).toUpperCase()}`;

    const newBadge: PeerVerifiedBadge = {
      id: 'badge-' + Date.now(),
      title: badgeTitle,
      subtitle: `Verified by ${session.expert.name} • ${session.expert.role} @ ${session.expert.company}`,
      verifierName: session.expert.name,
      verifierRole: `${session.expert.role} @ ${session.expert.company}`,
      verifierAvatar: session.expert.avatar,
      verifierCompany: session.expert.company,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      skills: payload.skillsVerified && payload.skillsVerified.length > 0 
        ? payload.skillsVerified 
        : session.expert.skills.slice(0, 4),
      status: 'verified',
      verificationHash: hash
    };

    // Update candidate profile with new badge & score boost
    const updatedCandidate = store.awardBadgeToCandidate(session.candidateId, newBadge);

    // Mark session completed
    const updatedSession = store.updateSession(sessionId, {
      status: 'completed',
      rating: payload.rating,
      feedbackNotes: payload.feedbackNotes,
      badgeAwarded: badgeTitle
    });

    if (!updatedSession) {
      throw new Error(`Failed to update session ${sessionId}`);
    }

    return {
      session: updatedSession,
      badge: newBadge,
      candidateProfileScore: updatedCandidate?.profileScore || 85,
      recruiterVisibilityBoost: '3.4x Higher Visibility in Recruiter Talent Search'
    };
  }
}

export const assessmentService = new AssessmentService();
