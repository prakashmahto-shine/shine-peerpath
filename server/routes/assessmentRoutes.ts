import { Router, Request, Response } from 'express';
import { assessmentService } from '../services/assessmentService';

const router = Router();

const handleBriefing = (req: Request, res: Response) => {
  try {
    const briefing = assessmentService.getZeroPrepDossier(req.params.id);
    return res.json({
      success: true,
      message: 'Zero-prep mentee dossier loaded in 0 minutes',
      data: briefing
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error generating session briefing' });
  }
};

const handleAssess = (req: Request, res: Response) => {
  try {
    const { rating, feedbackNotes, badgeTitle, skillsVerified, interviewReadinessScore } = req.body;
    
    if (!rating || !feedbackNotes) {
      return res.status(400).json({ error: 'rating and feedbackNotes are required' });
    }

    const result = assessmentService.submitAssessment(req.params.id, {
      rating: Number(rating),
      feedbackNotes,
      badgeTitle,
      skillsVerified: skillsVerified || [],
      interviewReadinessScore: Number(interviewReadinessScore) || 95
    });

    return res.json({
      success: true,
      message: 'Assessment completed! Peer-Verified Badge issued to candidate and visible in recruiter talent search.',
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error submitting assessment' });
  }
};

// Handle both /sessions/:id/briefing and /:id/briefing
router.get('/sessions/:id/briefing', handleBriefing);
router.get('/:id/briefing', handleBriefing);

// Handle both /sessions/:id/assess and /:id/assess
router.post('/sessions/:id/assess', handleAssess);
router.post('/:id/assess', handleAssess);

export default router;
