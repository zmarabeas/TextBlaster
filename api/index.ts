import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';

// Import server components
import { storage } from '../server/storage';
import { initializeDatabase } from '../server/initDatabase';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Initialize database once
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Simple authentication middleware
function authenticateUser(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDbInitialized();

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '/';

  try {
    // Auth endpoints
    if (path === '/auth/me' && method === 'GET') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (path === '/register' && method === 'POST') {
      const { username, email, password, fullName } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password, // In production, hash this password
        fullName
      });

      return res.json({ id: user.id, username: user.username, email: user.email });
    }

    if (path === '/login' && method === 'POST') {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      return res.json({ id: user.id, username: user.username, email: user.email });
    }

    // Payment endpoints
    if (path === '/create-payment-intent' && method === 'POST') {
      const { amount } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
      });

      return res.json({ clientSecret: paymentIntent.client_secret });
    }

    // Default response for unmatched routes
    return res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}