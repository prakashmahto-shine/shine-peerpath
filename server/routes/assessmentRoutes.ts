import { Router, Request, Response } from 'express';
import { assessmentService } from '../services/assessmentService';

const router = Router();

const handleBriefing = (req: Request<{ id: string }>, res: Response) => {
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

const handleAssess = (req: Request<{ id: string }>, res: Response) => {
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

const handleFeedback = (req: Request<{ id: string }>, res: Response) => {
  try {
    const { rating, reviewText } = req.body;
    if (!rating) {
      return res.status(400).json({ error: 'rating is required' });
    }

    const result = assessmentService.submitCandidateFeedback(req.params.id, {
      rating: Number(rating),
      reviewText: reviewText || ''
    });

    return res.json({
      success: true,
      message: 'Candidate review & rating submitted successfully',
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error submitting review' });
  }
};

// Handle both /sessions/:id/briefing and /:id/briefing
router.get('/sessions/:id/briefing', handleBriefing);
router.get('/:id/briefing', handleBriefing);

// Handle both /sessions/:id/assess and /:id/assess
router.post('/sessions/:id/assess', handleAssess);
router.post('/:id/assess', handleAssess);

// Handle candidate review submission
router.post('/sessions/:id/feedback', handleFeedback);
router.post('/:id/feedback', handleFeedback);

export default router;
