import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req: Request, res: Response) => {
res.json({ 
    status: 'ok', 
    message: 'bienvuimmo API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes - À implémenter
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agencies', require('./routes/agencies'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/mandates', require('./routes/mandates'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/matches', require('./routes/matches'));

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});
