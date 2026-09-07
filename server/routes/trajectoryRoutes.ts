import { Router, Request, Response } from 'express';
import { trajectoryService } from '../services/trajectoryService';

const router = Router();

// POST /api/trajectory/match - Match candidate to professionals who had their CV 3 years ago
router.post('/match', (req: Request, res: Response) => {
  try {
    const { currentRole, currentExperience, currentSalary, targetRole, targetPackage, domain, skills } = req.body;
    const matches = trajectoryService.matchTrajectories({
      currentRole: currentRole || 'Senior Frontend Engineer',
      currentExperience: currentExperience || '4 Years',
      currentSalary,
      targetRole,
      targetPackage,
      domain,
      skills: skills || []
    });

    return res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error matching trajectories' });
  }
});

// GET /api/trajectory/creators/:id - Get trajectory jump specifics for creator
router.get('/creators/:id', (req: Request, res: Response) => {
  try {
    const details = trajectoryService.getTrajectoryDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    return res.json({ success: true, data: details });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching trajectory details' });
  }
});

export default router;
