import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../server/routes';
import { initializeDatabase } from '../server/initDatabase';

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    [process.env.VERCEL_URL || '', 'https://*.vercel.app'] : 
    ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and routes
let initialized = false;

async function initializeApp() {
  if (!initialized) {
    try {
      await initializeDatabase();
      await registerRoutes(app);
      initialized = true;
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApp();
    
    // Handle the request with Express
    const expressHandler = app as any;
    expressHandler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}