import { store } from '../data/store';
import { Creator, TrajectoryMatch, DomainVertical } from '../types';
import { createEmbedding, cosineSimilarity } from './embeddingService';

interface CandidateTrajectoryInput {
  currentRole: string;
  currentExperience: string;
  currentSalary?: string;
  targetRole?: string;
  targetPackage?: string;
  domain?: DomainVertical | string;
  skills: string[];
}

export class TrajectoryService {
  /**
   * Trajectory Matching Algorithm:
   * 1. Dense Vector Distance: Compares candidate's baseline with creator's "role 3 years ago".
   * 2. Jump Goal Alignment: Compares candidate's target role with creator's current role via embeddings.
   * 3. Skill Bridge Overlap: Identifies exactly which booster skills the creator mastered to make that jump.
   * 4. Fit Over Follower Count: Ranks purely by career path delta and relevance.
   */
  public async matchTrajectories(input: CandidateTrajectoryInput): Promise<TrajectoryMatch[]> {
    const allCreators = store.getCreators();
    const candidateSkillsLower = (input.skills || []).map(s => s.toLowerCase());

    const candidateBaselineText = `${input.currentRole} ${(input.skills || []).join(' ')}`;
    const candidateTargetText = `${input.targetRole || input.currentRole} ${input.domain || ''}`;

    const [candidateBaselineVec, candidateTargetVec] = await Promise.all([
      createEmbedding(candidateBaselineText),
      createEmbedding(candidateTargetText)
    ]);

    const matches: TrajectoryMatch[] = await Promise.all(allCreators.map(async creator => {
      const creatorPastText = `${creator.trajectory.role3YearsAgo} ${creator.trajectory.company3YearsAgo} ${creator.trajectory.keyJumpSkills.join(' ')}`;
      const creatorCurrentText = `${creator.role} ${creator.company} ${creator.skills.join(' ')}`;

      const [creatorPastVec, creatorCurrentVec] = await Promise.all([
        createEmbedding(creatorPastText),
        createEmbedding(creatorCurrentText)
      ]);

      const pastSim = Math.max(0, cosineSimilarity(candidateBaselineVec, creatorPastVec));
      const targetSim = Math.max(0, cosineSimilarity(candidateTargetVec, creatorCurrentVec));

      // Domain match bonus
      let domainBonus = 0;
      if (input.domain) {
        const inDom = input.domain.toLowerCase();
        const cDom = creator.domain.toLowerCase();
        if (cDom.includes(inDom) || inDom.includes(cDom)) {
          domainBonus = 0.45;
        }
      }

      // Verified employer bonus
      const verifiedBonus = creator.isVerifiedEmployer ? 0.05 : 0;

      // Composite semantic score (0 to 1)
      const compositeScore = (pastSim * 0.35) + (targetSim * 0.35) + domainBonus + verifiedBonus;

      // Scale appropriately: clamped between 72% and 98%
      const normalizedScore = Math.min(98, Math.max(72, Math.round(68 + (compositeScore * 40))));

      // Missing booster skills
      const missingBridgeSkills = creator.trajectory.keyJumpSkills.filter(
        skill => !candidateSkillsLower.some(cs => cs.includes(skill.toLowerCase()))
      );

      const matchReasons = [
        `Trajectory Baseline (${Math.round(pastSim * 100)}%): ${creator.name.split(' ')[0]} was a "${creator.trajectory.role3YearsAgo}" (${creator.trajectory.salary3YearsAgo}) before making this exact career jump.`,
        `Target Trajectory (${Math.round(targetSim * 100)}%): Direct employer pipeline to "${creator.role}" at ${creator.company}.`,
        `High-Leverage Bridge: Accelerates missing skills: ${missingBridgeSkills.slice(0, 2).join(' & ') || 'Advanced Architecture'}.`
      ];

      return {
        creator,
        trajectorySimilarityScore: normalizedScore,
        jumpDelta: `${creator.trajectory.salary3YearsAgo} ➔ ${creator.price ? '₹22L - ₹34L' : '₹26L'}`,
        matchReasons,
        criticalBoosterSkills: missingBridgeSkills.length > 0 ? missingBridgeSkills : creator.skills.slice(0, 3),
        suggestedSessionGoal: `1:1 CV Teardown & Transition Strategy into ${creator.role} at ${creator.company}`
      };
    }));

    // Sort descending by trajectory similarity
    matches.sort((a, b) => b.trajectorySimilarityScore - a.trajectorySimilarityScore);

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

    return uniqueMatches;
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
