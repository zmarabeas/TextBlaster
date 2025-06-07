import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '/';

  // Auth endpoints - simplified for deployment
  if (path === '/auth/me' && method === 'GET') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (path === '/test' && method === 'GET') {
    return res.json({ 
      message: 'TextBlaster API is working', 
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  }

  // Default response
  return res.status(404).json({ message: 'Endpoint not found', path, method });
}