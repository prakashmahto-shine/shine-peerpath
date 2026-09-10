import { Router, Request, Response } from 'express';
import { store } from '../data/store';

const router = Router();

// GET /api/candidates/:id - Get a candidate's full profile
router.get('/:id', (req: Request, res: Response) => {
  try {
    const candidate = store.getCandidate(req.params.id);
    if (!candidate) {
      return res.status(404).json({ error: `Candidate ${req.params.id} not found` });
    }
    return res.json({ success: true, data: candidate });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching candidate' });
  }
});

// PUT /api/candidates/:id - Persist candidate profile edits to db.json
router.put('/:id', (req: Request, res: Response) => {
  try {
    const updated = store.updateCandidate(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ error: `Candidate ${req.params.id} not found` });
    }
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error updating candidate' });
  }
});

export default router;
