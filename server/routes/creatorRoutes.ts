import { Router, Request, Response } from 'express';
import { creatorService } from '../services/creatorService';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const teasersDir = path.resolve(__dirname, '../data/recordings');
if (!fs.existsSync(teasersDir)) {
  fs.mkdirSync(teasersDir, { recursive: true });
}

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
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
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

// PUT /api/creators/:id - Update creator profile details
router.put('/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const updated = creatorService.update(req.params.id, req.body || {});
    if (!updated) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    return res.json({ success: true, message: 'Creator profile updated successfully', data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error updating creator profile' });
  }
});

// PUT /api/creators/:id/availability - Update creator weekly availability
router.put('/:id/availability', (req: Request<{ id: string }>, res: Response) => {
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

// POST /api/creators/:id/teaser-video - Upload 60-second teaser video file (Binary buffer / Base64)
router.post('/:id/teaser-video', (req: Request<{ id: string }>, res: Response) => {
  try {
    const creatorId = req.params.id;
    const filePath = path.join(teasersDir, `teaser-${creatorId}.mp4`);

    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      fs.writeFileSync(filePath, req.body);
    } else if (req.body && req.body.base64Data) {
      const base64Data = req.body.base64Data.replace(/^data:video\/\w+;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    } else {
      // Create valid mock marker if metadata only
      fs.writeFileSync(filePath, Buffer.from('PEERPATH_TEASER_REEL_DATA'));
    }

    const duration = req.body?.duration || '01:00';
    const teaserTitle = req.body?.title || undefined;
    const teaserVideoUrl = `/api/creators/${creatorId}/teaser-video`;

    // Persist teaser video URL and details in creator profile
    const updated = creatorService.update(creatorId, {
      duration,
      ...(teaserTitle ? { teaserTitle } : {})
    });

    console.log(`[Teaser Upload] Teaser video uploaded for creator "${creatorId}" (${fs.statSync(filePath).size} bytes)`);

    return res.status(200).json({
      success: true,
      message: '60-second teaser video uploaded and published successfully!',
      data: {
        creatorId,
        teaserVideoUrl,
        duration,
        sizeBytes: fs.statSync(filePath).size,
        creator: updated
      }
    });
  } catch (error: any) {
    console.error('[Teaser Upload Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to upload teaser video' });
  }
});

// GET /api/creators/:id/teaser-video - Stream teaser video with HTTP 206 Range seeking
router.get('/:id/teaser-video', (req: Request<{ id: string }>, res: Response) => {
  try {
    const creatorId = req.params.id;
    let filePath = path.join(teasersDir, `teaser-${creatorId}.mp4`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(teasersDir, `teaser-${creatorId}.webm`);
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Teaser video not found for this creator' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': filePath.endsWith('.webm') ? 'video/webm' : 'video/mp4'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': filePath.endsWith('.webm') ? 'video/webm' : 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error streaming teaser video' });
  }
});

export default router;
