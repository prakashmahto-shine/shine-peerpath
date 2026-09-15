import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cvRoutes from './routes/cvRoutes';
import trajectoryRoutes from './routes/trajectoryRoutes';
import creatorRoutes from './routes/creatorRoutes';
import candidateRoutes from './routes/candidateRoutes';
import bookingRoutes from './routes/bookingRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import jobRoutes from './routes/jobRoutes';
import communityRoutes from './routes/communityRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { setupSocketService } from './services/socketService';
import { store } from './data/store';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);

// Initialize WebRTC Socket.IO signaling service
const io = setupSocketService(httpServer);

const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 5001;
const HOST = '0.0.0.0';

// Ensure recordings directory exists
const recordingsDir = path.resolve(__dirname, 'data/recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.raw({ type: ['video/*', 'application/octet-stream'], limit: '250mb' }));

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.originalUrl.startsWith('/api/sessions/') || !req.originalUrl.endsWith('/recording')) {
    console.log(`[API] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'shine-peerpath-backend-api',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    domainsSupported: ['AI/ML', 'Semiconductor', 'Cybersecurity', 'Full-Stack', 'SaaS Sales', 'Marketing'],
    version: '1.0.0',
    signaling: 'socket.io-webrtc-active'
  });
});

// ==============================================================================
// Session Video Recording Upload & Streaming Routes
// ==============================================================================

// Upload recording (binary or base64)
app.post('/api/sessions/:id/recording', (req: Request<{ id: string }>, res: Response) => {
  try {
    const sessionId = req.params.id as string;
    const filePath = path.join(recordingsDir, `sess-${sessionId}.webm`);

    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      fs.writeFileSync(filePath, req.body);
    } else if (req.body && req.body.base64Data) {
      const base64Data = req.body.base64Data.replace(/^data:video\/\w+;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    } else {
      // Fallback empty marker if client sent metadata only
      fs.writeFileSync(filePath, Buffer.from('PEERPATH_RECORDING_MARKER'));
    }

    const duration = Number(req.body?.duration) || 0;
    const recordingUrl = `/api/sessions/${sessionId}/recording`;

    // Update in database store
    store.updateSession(sessionId, {
      recordingUrl,
      hasRecording: true,
      ...(duration > 0 ? { recordingDuration: duration } : {})
    });

    console.log(`[Recording] Successfully saved recording for session "${sessionId}" (${fs.statSync(filePath).size} bytes)`);

    return res.status(200).json({
      success: true,
      message: 'Session recording saved successfully',
      recordingUrl,
      sessionId
    });
  } catch (error: any) {
    console.error('[Recording Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to save recording' });
  }
});

// Stream session recording with HTTP 206 Range support for video seeking
app.get('/api/sessions/:id/recording', (req: Request<{ id: string }>, res: Response) => {
  try {
    const sessionId = req.params.id as string;
    const filePath = path.join(recordingsDir, `sess-${sessionId}.webm`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Session recording not found' });
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
        'Content-Type': 'video/webm'
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/webm'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error streaming recording' });
  }
});

// Register Subsystem Routes
app.use('/api/cv', cvRoutes);
app.use('/api/trajectory', trajectoryRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', bookingRoutes);
app.use('/api/creator', assessmentRoutes);
app.use('/api/sessions', assessmentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/demo', analyticsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend build (production)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for non-API client routing (Express 5 compatible)
app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send('Shine Peerpath API Server is running! (Frontend build not found, run npm run build to generate dist)');
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

httpServer.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Shine Peerpath Backend API & WebRTC Signaling running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📹 WebRTC Signaling: Socket.io active on root path`);
  console.log(`🎯 Underserved Verticals: AI/ML, Semiconductor, Cybersecurity, Full-Stack`);
  console.log(`====================================================`);
});

export default app;
export { httpServer, io };
