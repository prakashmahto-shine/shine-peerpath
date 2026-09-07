import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { store } from '../data/store';

const router = Router();

// GET /api/analytics/metrics - Pitch metrics & marketplace health
router.get('/metrics', (_req: Request, res: Response) => {
  try {
    const metrics = analyticsService.getMetrics();
    return res.json(metrics);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching analytics' });
  }
});

// POST /api/demo/reset - Reset demo database to initial pristine state
router.post('/reset', (_req: Request, res: Response) => {
  try {
    store.resetToDefault();
    return res.json({
      success: true,
      message: 'Demo database reset to pristine seed state across all 4 verticals.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error resetting demo data' });
  }
});

export default router;
