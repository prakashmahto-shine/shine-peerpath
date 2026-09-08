import { Router, Request, Response } from 'express';
import { cvService } from '../services/cvService';

const router = Router();

// POST /api/cv/parse - Parse resume text
router.post('/parse', (req: Request, res: Response) => {
  try {
    const { cvText, metadata } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: 'cvText string is required' });
    }
    const result = cvService.parseCv(cvText, metadata);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error parsing CV' });
  }
});

// POST /api/cv/gap-analysis - Analyze gap against target domain JD
router.post('/gap-analysis', async (req: Request, res: Response) => {
  try {
    const { domain, skills, currentRole, currentCtc } = req.body;
    const result = await cvService.performGapAnalysis(
      domain || 'full-stack',
      skills || [],
      currentRole || 'Senior Frontend Engineer',
      currentCtc || '₹7.5 LPA'
    );
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error running gap analysis' });
  }
});

// POST /api/cv/pathways-analysis - Analyze all pathway tracks in parallel
router.post('/pathways-analysis', async (req: Request, res: Response) => {
  try {
    const { skills, currentRole, currentCtc } = req.body;
    const tracks = ['arch', 'pm', 'search', 'ai', 'semi'];
    const results: Record<string, any> = {};

    await Promise.all(
      tracks.map(async (trackKey) => {
        results[trackKey] = await cvService.performGapAnalysis(
          trackKey,
          skills || [],
          currentRole || 'Senior Frontend Engineer',
          currentCtc || '₹7.5 LPA'
        );
      })
    );

    return res.json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error running pathways analysis' });
  }
});

export default router;
