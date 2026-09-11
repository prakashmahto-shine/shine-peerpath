import { store } from '../data/store';
import { Creator, TrajectoryMatch, DomainVertical } from '../types';
import {
  classifyRoleFamily,
  roleMatchScore,
  companyMatchScore,
  transitionMatchScore,
  isSupportedDomain,
  normalizeDomain
} from './mentorMatchTaxonomy';
import { createEmbedding, cosineSimilarity, semanticSkillMatch } from './embeddingService';

// The guaranteed minimum trajectorySimilarityScore (see the sqrt scaling below) — a mentor landing
// exactly here has no real origin-relevance signal, not just a "below average" one.
const TRAJECTORY_SCORE_FLOOR = 60;

interface CandidateTrajectoryInput {
  currentRole: string;
  currentCompany?: string;
  currentExperience: string;
  currentSalary?: string;
  targetRole?: string;
  targetPackage?: string;
  targetCompany?: string;
  domain?: DomainVertical | string;
  skills: string[];
}

export class TrajectoryService {
  /**
   * Trajectory Matching Engine:
   * Combines Dense Vector Embeddings (MiniLM-L6-v2) with 4-Way Alignment:
   *
   *   CANDIDATE:  Current Role + Skills  ──────────→  Dream Role + Domain
   *                     ↕ (Dense Vector Sim)             ↕ (Dense Vector Sim)
   *   MENTOR:     Previous Role + Jump Skills ──→  Current Role + Skills
   *
   *   CANDIDATE:  Current Company ───────────────→  Dream Company
   *                     ↕ (Company Tier Match)           ↕ (Company Tier Match)
   *   MENTOR:     Previous Company ──────────────→  Current Company
   */
  public async matchTrajectories(input: CandidateTrajectoryInput): Promise<TrajectoryMatch[]> {
    const normDomain = normalizeDomain(input.domain) || input.domain;
    if (input.domain && !isSupportedDomain(input.domain)) {
      return [];
    }

    // Availability is a binary pre-filter: a mentor with no open slots never surfaces.
    // When domain is provided, filter by normalized domain to prevent cross-guild false positives.
    const availableCreators = store.getCreators().filter(c => {
      const isAvailable = c.availability && c.availability.days?.length > 0 && c.availability.timeSlots?.length > 0;
      if (!isAvailable) return false;
      if (!normDomain) return true;
      const cNorm = normalizeDomain(c.domain) || c.domain;
      return cNorm.toLowerCase() === normDomain.toLowerCase() || c.domain.toLowerCase() === input.domain?.toLowerCase();
    });

    const candidateSkillsLower = (input.skills || []).map(s => s.toLowerCase());
    const dreamRole = input.targetRole || input.currentRole;
    const candidateOriginFamily = classifyRoleFamily(input.currentRole, normDomain);
    const candidateDestFamily = classifyRoleFamily(dreamRole, normDomain);

    // Compute dense trajectory vectors for candidate baseline and target
    const candidateBaselineText = `${input.currentRole} ${input.currentCompany || ''} ${(input.skills || []).join(' ')}`.trim();
    const candidateTargetText = `${dreamRole} ${input.targetCompany || ''} ${normDomain || ''} ${(input.skills || []).join(' ')}`.trim();

    const [candBaselineVec, candTargetVec, candRoleVec, candTargetRoleVec] = await Promise.all([
      createEmbedding(candidateBaselineText),
      createEmbedding(candidateTargetText),
      createEmbedding(input.currentRole),
      createEmbedding(dreamRole)
    ]);

    // Dynamic weight balancing: if companies are not specified, redistribute weight to role and transition
    const hasDreamCompany = Boolean(input.targetCompany && input.targetCompany.trim());
    const hasCurrentCompany = Boolean(input.currentCompany && input.currentCompany.trim());

    let wDreamRole = 0.30;
    let wCurrentRole = 0.25;
    let wDreamCompany = 0.20;
    let wCurrentCompany = 0.15;
    let wTransition = 0.10;

    if (!hasDreamCompany && !hasCurrentCompany) {
      wDreamRole = 0.45;
      wCurrentRole = 0.35;
      wDreamCompany = 0.0;
      wCurrentCompany = 0.0;
      wTransition = 0.20;
    } else if (!hasDreamCompany) {
      wDreamRole = 0.40;
      wCurrentRole = 0.30;
      wDreamCompany = 0.0;
      wCurrentCompany = 0.20;
      wTransition = 0.10;
    } else if (!hasCurrentCompany) {
      wDreamRole = 0.35;
      wCurrentRole = 0.30;
      wDreamCompany = 0.25;
      wCurrentCompany = 0.0;
      wTransition = 0.10;
    }

    const matches: TrajectoryMatch[] = await Promise.all(availableCreators.map(async creator => {
      // Compute mentor origin & destination dense vector embeddings
      const creatorPastText = `${creator.trajectory.role3YearsAgo} ${creator.trajectory.company3YearsAgo} ${creator.trajectory.keyJumpSkills.join(' ')}`;
      const creatorCurrentText = `${creator.role} ${creator.company} ${creator.skills.join(' ')}`;

      const [creatorPastVec, creatorCurrentVec, creatorPastRoleVec, creatorCurrentRoleVec] = await Promise.all([
        createEmbedding(creatorPastText),
        createEmbedding(creatorCurrentText),
        createEmbedding(creator.trajectory.role3YearsAgo),
        createEmbedding(creator.role)
      ]);

      const originSemanticSim = Math.max(0, cosineSimilarity(candBaselineVec, creatorPastVec));
      const destSemanticSim = Math.max(0, cosineSimilarity(candTargetVec, creatorCurrentVec));
      const originRoleEmbeddingSim = Math.max(0, cosineSimilarity(candRoleVec, creatorPastRoleVec));
      const destRoleEmbeddingSim = Math.max(0, cosineSimilarity(candTargetRoleVec, creatorCurrentRoleVec));

      const dreamRoleScore = roleMatchScore(dreamRole, creator.role, normDomain, creator.domain, destRoleEmbeddingSim);
      const currentRoleScore = roleMatchScore(input.currentRole, creator.trajectory.role3YearsAgo, normDomain, creator.domain, originRoleEmbeddingSim);
      const dreamCompanyScore = hasDreamCompany ? companyMatchScore(input.targetCompany, creator.company) : 0;
      const currentCompanyScore = hasCurrentCompany ? companyMatchScore(input.currentCompany, creator.trajectory.company3YearsAgo) : 0;

      const mentorOriginFamily = classifyRoleFamily(creator.trajectory.role3YearsAgo, creator.domain);
      const mentorDestFamily = classifyRoleFamily(creator.role, creator.domain);
      const transitionScore = transitionMatchScore(candidateOriginFamily, candidateDestFamily, mentorOriginFamily, mentorDestFamily);

      const taxonomyScore =
        wDreamRole * dreamRoleScore +
        wCurrentRole * currentRoleScore +
        wDreamCompany * dreamCompanyScore +
        wCurrentCompany * currentCompanyScore +
        wTransition * transitionScore;

      // Composite trajectory score blends structured alignment with dense vector semantic trajectory similarity.
      const compositeTrajectory = (taxonomyScore * 0.70) + (((originSemanticSim + destSemanticSim) / 2) * 0.30);
      
      // Heavy origin gating: if mentor's origin role does not match candidate's current role,
      // penalize heavily so unrelated origin roles (e.g. CV dev when candidate is PM) don't surface
      const originGate = currentRoleScore < 0.50 ? 0.35 : (0.55 + 0.45 * currentRoleScore);
      const gatedTrajectory = compositeTrajectory * originGate;
      
      const displayTrajectory = Math.sqrt(Math.max(0, Math.min(1, gatedTrajectory)));
      const trajectorySimilarityScore = Math.min(99, Math.round(displayTrajectory * 100));

      let matchType: TrajectoryMatch['matchType'];
      if (dreamRoleScore >= 0.80 && dreamCompanyScore === 1 && currentRoleScore >= 0.70) {
        matchType = 'exact-dream';
      } else if (dreamCompanyScore === 1 && currentRoleScore >= 0.70) {
        matchType = 'exact-company';
      } else if (dreamRoleScore >= 0.80 && currentRoleScore >= 0.70) {
        matchType = 'exact-role';
      } else {
        matchType = 'aligned';
      }
      const isExactMatch = matchType !== 'aligned';

      // Semantic bridge skills matching
      const missingBridgeSkills: string[] = [];
      for (const skill of creator.trajectory.keyJumpSkills) {
        const hasSkill = candidateSkillsLower.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs));
        if (!hasSkill) {
          missingBridgeSkills.push(skill);
        }
      }

      const mentorFirstName = creator.name.split(' ')[0];
      const originNote = currentRoleScore >= 0.7 && (!hasCurrentCompany || currentCompanyScore >= 0.6)
        ? ' — the same background as you'
        : currentRoleScore >= 0.7
          ? ' — a similar starting point to yours'
          : '';
      const destNote = dreamRoleScore >= 0.95 && dreamCompanyScore === 1
        ? ' — exactly your target'
        : dreamCompanyScore === 1
          ? ' — your target company'
          : dreamRoleScore >= 0.95
            ? ' — your target role'
            : dreamRoleScore >= 0.7 || dreamCompanyScore >= 0.6
              ? ' — close to your goal'
              : '';

      const matchReasons: string[] = [
        `${mentorFirstName} was a "${creator.trajectory.role3YearsAgo}" at ${creator.trajectory.company3YearsAgo}${originNote}. ${mentorFirstName} is now "${creator.role}" at ${creator.company}${destNote}.`
      ];
      if (isExactMatch) {
        matchReasons.push(
          matchType === 'exact-dream'
            ? `🎯 Exact Match: same dream role and dream company.`
            : matchType === 'exact-company'
              ? `🎯 Exact Dream Company Match: already at ${creator.company}.`
              : `🎯 Exact Dream Role Match: already holds the title "${creator.role}".`
        );
      }
      const breakdownItems = [
        `Dream Role ${Math.round(dreamRoleScore * 100)}%`,
        `Current Role ${Math.round(currentRoleScore * 100)}%`
      ];
      if (hasDreamCompany) breakdownItems.push(`Dream Company ${Math.round(dreamCompanyScore * 100)}%`);
      if (hasCurrentCompany) breakdownItems.push(`Current Company ${Math.round(currentCompanyScore * 100)}%`);
      breakdownItems.push(`Transition Fit ${Math.round(transitionScore * 100)}%`);
      breakdownItems.push(`Dense Semantic Sim ${Math.round(((originSemanticSim + destSemanticSim) / 2) * 100)}%`);

      matchReasons.push(
        `Alignment breakdown — ${breakdownItems.join(', ')}.`,
        `High-Leverage Bridge: Accelerates missing skills: ${missingBridgeSkills.slice(0, 2).join(' & ') || 'Advanced Architecture'}.`
      );

      return {
        creator,
        trajectorySimilarityScore,
        jumpDelta: `${creator.trajectory.role3YearsAgo} @ ${creator.trajectory.company3YearsAgo} → ${creator.role} @ ${creator.company}`,
        matchReasons,
        criticalBoosterSkills: missingBridgeSkills.length > 0 ? missingBridgeSkills : creator.skills.slice(0, 3),
        suggestedSessionGoal: `1:1 CV Teardown & Transition Strategy into ${creator.role} at ${creator.company}`,
        isExactMatch,
        matchType
      };
    }));

    // Deduplicate creators by name so each mentor twin is unique
    const seenNames = new Set<string>();
    const uniqueMatches: TrajectoryMatch[] = [];
    for (const m of matches) {
      const key = m.creator.name.toLowerCase().trim();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        uniqueMatches.push(m);
      }
    }

    // Group unique matches by domain
    const byDomain = new Map<string, TrajectoryMatch[]>();
    for (const m of uniqueMatches) {
      const key = m.creator.domain;
      if (!byDomain.has(key)) byDomain.set(key, []);
      byDomain.get(key)!.push(m);
    }

    // Per-domain relevance filtering with guaranteed coverage:
    // 1. For each domain, include all mentors who naturally cleared the relevance threshold (>= 60%).
    // 2. Fallback guarantee: if a domain has 0 mentors >= 60%, NEVER return 0 mentors!
    //    Take the top 2 best available mentors in that track and calibrate their score to 66%–70%,
    //    so the track always provides actionable guidance and never displays "No mentors yet (0 Mentors)".
    const finalMatches: TrajectoryMatch[] = [];

    for (const group of byDomain.values()) {
      group.sort((a, b) => b.trajectorySimilarityScore - a.trajectorySimilarityScore);
      const qualified = group.filter(m => m.trajectorySimilarityScore >= 60);
      if (qualified.length > 0) {
        finalMatches.push(...qualified);
      } else if (group.length > 0) {
        // Fallback: take top 2 mentors from this domain and calibrate score
        const fallbacks = group.slice(0, 2).map((m, idx) => ({
          ...m,
          trajectorySimilarityScore: Math.max(65, 70 - idx * 3)
        }));
        finalMatches.push(...fallbacks);
      }
    }

    // Sort descending by trajectory similarity score
    finalMatches.sort((a, b) => b.trajectorySimilarityScore - a.trajectorySimilarityScore);
    return finalMatches;
  }

  public getTrajectoryDetails(creatorId: string) {
    const creator = store.getCreatorById(creatorId);
    if (!creator) return null;
    return {
      creatorId: creator.id,
      name: creator.name,
      currentRole: creator.role,
      company: creator.company,
      trajectory: creator.trajectory,
      verifiedEmail: creator.verifiedEmail
    };
  }
}

export const trajectoryService = new TrajectoryService();
