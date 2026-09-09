import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cvRoutes from './routes/cvRoutes';
import trajectoryRoutes from './routes/trajectoryRoutes';
import creatorRoutes from './routes/creatorRoutes';
import bookingRoutes from './routes/bookingRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import jobRoutes from './routes/jobRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 5001;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'shine-peerpath-backend-api',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    domainsSupported: ['AI/ML', 'Semiconductor', 'Cybersecurity', 'Full-Stack'],
    version: '1.0.0'
  });
});

// Register Subsystem Routes
app.use('/api/cv', cvRoutes);
app.use('/api/trajectory', trajectoryRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', bookingRoutes);
app.use('/api/creator', assessmentRoutes);
app.use('/api/sessions', assessmentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/demo', analyticsRoutes);
app.use('/api/jobs', jobRoutes);

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

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 Shine Peerpath Backend API Server running on port ${PORT} (host: ${HOST})`);
  console.log(`🔗 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`🎯 Underserved Verticals: AI/ML, Semiconductor, Cybersecurity, Full-Stack`);
  console.log(`====================================================`);
});

export default app;
