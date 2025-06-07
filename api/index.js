export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '/';

  // Health check endpoint
  if (path === '/health' && method === 'GET') {
    return res.json({ 
      status: 'healthy',
      message: 'TextBlaster API is running', 
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  }

  // Test endpoint
  if (path === '/test' && method === 'GET') {
    return res.json({ 
      message: 'TextBlaster API is working', 
      timestamp: new Date().toISOString(),
      environment: 'production'
    });
  }

  // Auth endpoints - simplified for deployment
  if (path === '/auth/me' && method === 'GET') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (path === '/auth/login' && method === 'POST') {
    return res.status(501).json({ 
      message: 'Authentication not yet implemented',
      note: 'Login system will be added after successful deployment'
    });
  }

  if (path === '/auth/register' && method === 'POST') {
    return res.status(501).json({ 
      message: 'Registration not yet implemented',
      note: 'Registration system will be added after successful deployment'
    });
  }

  // Client management endpoints
  if (path === '/clients' && method === 'GET') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (path === '/clients' && method === 'POST') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Message endpoints
  if (path === '/messages' && method === 'GET') {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (path === '/messages/send' && method === 'POST') {
    return res.status(501).json({ 
      message: 'SMS functionality not yet implemented',
      note: 'Twilio integration will be added after successful deployment'
    });
  }

  // Payment endpoint placeholder
  if (path === '/create-payment-intent' && method === 'POST') {
    return res.status(501).json({ 
      message: 'Payment processing not yet implemented',
      note: 'Stripe integration will be added after successful deployment'
    });
  }

  // Default response
  return res.status(404).json({ 
    message: 'Endpoint not found', 
    path, 
    method,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/test', 
      'GET /api/auth/me',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/clients',
      'POST /api/clients',
      'GET /api/messages',
      'POST /api/messages/send',
      'POST /api/create-payment-intent'
    ]
  });
}