import { Router, Request, Response } from 'express';
import { creatorService } from '../services/creatorService';

const router = Router();

// GET /api/creators - List verified creators with optional domain/query filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const domain = req.query.domain as string | undefined;
    const query = req.query.q as string | undefined;
    const creators = creatorService.getAll(domain, query);
    return res.json({
      success: true,
      count: creators.length,
      data: creators
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching creators' });
  }
});

// GET /api/creators/:id - Get specific creator by id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const creator = creatorService.getById(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: `Creator ${req.params.id} not found` });
    }
    return res.json({ success: true, data: creator });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching creator' });
  }
});

// POST /api/creators/register - Onboard/publish creator profile (supports 0-cold-start pre-fill from Shine)
router.post('/register', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.name || !body.role || !body.company) {
      return res.status(400).json({ error: 'name, role, and company are required' });
    }

    const newCreator = creatorService.register({
      name: body.name,
      role: body.role,
      company: body.company,
      domain: body.domain || 'Full-Stack',
      experience: body.experience,
      price: Number(body.price) || 999,
      duration: body.duration || '01:15',
      skills: body.skills || ['System Design', 'React.js'],
      bio: body.bio || '',
      avatar: body.avatar,
      videoPoster: body.videoPoster,
      teaserTitle: body.teaserTitle,
      verifiedEmail: body.verifiedEmail,
      days: body.days,
      timeSlots: body.timeSlots,
      role3YearsAgo: body.role3YearsAgo,
      company3YearsAgo: body.company3YearsAgo,
      salary3YearsAgo: body.salary3YearsAgo
    });

    return res.status(201).json({
      success: true,
      message: 'Creator published successfully to Shine Peerpath!',
      data: newCreator
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error registering creator' });
  }
});

// PUT /api/creators/:id/availability - Update creator weekly availability
router.put('/:id/availability', (req: Request, res: Response) => {
  try {
    const { days, timeSlots } = req.body;
    if (!days || !timeSlots) {
      return res.status(400).json({ error: 'days and timeSlots arrays are required' });
    }
    const updated = creatorService.updateAvailability(req.params.id, days, timeSlots);
    if (!updated) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error updating availability' });
  }
});

export default router;
