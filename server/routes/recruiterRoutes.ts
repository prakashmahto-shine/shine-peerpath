import { Router, Request, Response } from 'express';
import { recruiterService } from '../services/recruiterService';

const router = Router();

// POST /api/recruiter/match - Explain candidate fit for a specific role
router.post('/match', async (req: Request, res: Response) => {
  try {
    const { roleTitle, requiredSkills, candidateId, peerVerifiedOnly } = req.body;
    if (!roleTitle || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'roleTitle and requiredSkills are required' });
    }

    const matches = await recruiterService.matchCandidatesToRole({
      roleTitle,
      requiredSkills,
      candidateId,
      peerVerifiedOnly
    });

    return res.json({
      success: true,
      data: {
        roleTitle,
        requiredSkills,
        embeddingProvider: 'local-transformers-minilm',
        matches
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error matching candidates' });
  }
});

// GET /api/recruiter/candidates - Search thin-pool candidates with peer verification filter
router.get('/candidates', async (req: Request, res: Response) => {
  try {
    const domain = req.query.domain as string | undefined;
    const query = req.query.q as string | undefined;
    const peerVerifiedOnly = req.query.peer_verified_only === 'true';
    const minScore = req.query.min_score ? Number(req.query.min_score) : undefined;

    const results = await recruiterService.searchCandidates({
      domain,
      query,
      peerVerifiedOnly,
      minScore
    });

    return res.json({
      success: true,
      data: results
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error searching candidates' });
  }
});

// POST /api/recruiter/invite - Send direct interview outreach with peer-verified priority
router.post('/invite', (req: Request, res: Response) => {
  try {
    const { candidateId, recruiterName, company, roleTitle, message } = req.body;
    if (!candidateId || !company || !roleTitle) {
      return res.status(400).json({ error: 'candidateId, company, and roleTitle are required' });
    }

    const result = recruiterService.sendInterviewInvite(candidateId, {
      recruiterName: recruiterName || 'Senior Technical Recruiter',
      company,
      roleTitle,
      message
    });

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error sending invite' });
  }
});

export default router;
