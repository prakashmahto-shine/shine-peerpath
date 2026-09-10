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
    const { domain, skills, currentRole, currentCtc, currentCompany, targetCompany, dreamCompany } = req.body;
    const result = await cvService.performGapAnalysis(
      domain || 'full-stack',
      skills || [],
      currentRole || 'Senior Frontend Engineer',
      currentCtc || '₹7.5 LPA',
      currentCompany,
      targetCompany || dreamCompany
    );
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error running gap analysis' });
  }
});

// GET & POST /api/cv/pathways-analysis - Analyze all pathway tracks in parallel
const handlePathwaysAnalysis = async (req: Request, res: Response) => {
  try {
    const rawSkills = req.body?.skills || req.query.skills;
    const skills = Array.isArray(rawSkills) 
      ? rawSkills 
      : (typeof rawSkills === 'string' ? rawSkills.split(',').map(s => s.trim()) : ['React.js', 'TypeScript', 'JavaScript']);
    const currentRole = req.body?.currentRole || (req.query.currentRole as string) || 'Senior Frontend Engineer';
    const currentCtc = req.body?.currentCtc || (req.query.currentCtc as string) || '₹7.5 LPA';
    const currentCompany = req.body?.currentCompany || (req.query.currentCompany as string);
    const targetCompany = req.body?.targetCompany || req.body?.dreamCompany || (req.query.targetCompany as string) || (req.query.dreamCompany as string);

    const tracks = ['arch', 'pm', 'search', 'ai', 'semi'];
    const results: Record<string, any> = {};

    await Promise.all(
      tracks.map(async (trackKey) => {
        results[trackKey] = await cvService.performGapAnalysis(
          trackKey,
          skills,
          currentRole,
          currentCtc,
          currentCompany,
          targetCompany
        );
      })
    );

    return res.json({ success: true, data: results });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error running pathways analysis' });
  }
};

router.post('/pathways-analysis', handlePathwaysAnalysis);
router.get('/pathways-analysis', handlePathwaysAnalysis);

export default router;
