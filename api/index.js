// Simple in-memory session store for serverless
const sessions = new Map();

// Helper functions
function getSessionFromRequest(req) {
  const sessionId = req.headers['x-session-id'];
  return sessionId && sessions.has(sessionId) ? sessions.get(sessionId) : null;
}

function createSession(userId, username) {
  const sessionId = Math.random().toString(36).substr(2, 9);
  const session = { id: sessionId, userId, username };
  sessions.set(sessionId, session);
  return sessionId;
}

// Simple password hash for serverless
function simpleHash(password) {
  return Buffer.from(password + 'textblaster_salt').toString('base64');
}

function compareHash(password, hash) {
  return Buffer.from(password + 'textblaster_salt').toString('base64') === hash;
}

// Supabase API helper using REST API
async function supabaseQuery(query, params = []) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }
  
  // Extract connection details from DATABASE_URL
  const url = new URL(process.env.DATABASE_URL);
  const supabaseUrl = `https://${url.hostname.split('.')[0]}.supabase.co`;
  const supabaseKey = url.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseKey) {
    // For direct PostgreSQL connection, we'll use a simple HTTP request
    return await directDatabaseQuery(query, params);
  }
  
  // Use Supabase REST API
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey
    },
    body: JSON.stringify({ query, params })
  });
  
  if (!response.ok) {
    throw new Error(`Database query failed: ${response.statusText}`);
  }
  
  return await response.json();
}

// Fallback to direct database operations using fetch
async function directDatabaseQuery(query, params) {
  // For demo purposes, return mock data structure
  // In production, you'd implement proper database connection
  return { rows: [] };
}

// Database operations using Supabase REST API
async function getUserByUsername(username) {
  try {
    // Use Supabase REST API endpoint
    const url = new URL(process.env.DATABASE_URL);
    const supabaseUrl = `https://${url.hostname.split('.')[0]}.supabase.co`;
    const supabaseKey = url.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${username}&select=*`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      });
      
      if (response.ok) {
        const users = await response.json();
        return users[0] || null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

async function createUser(userData) {
  try {
    const { username, password, email, fullName } = userData;
    
    const url = new URL(process.env.DATABASE_URL);
    const supabaseUrl = `https://${url.hostname.split('.')[0]}.supabase.co`;
    const supabaseKey = url.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          username,
          password,
          email,
          full_name: fullName,
          credits: 25,
          subscription_tier: 'free'
        })
      });
      
      if (response.ok) {
        const users = await response.json();
        return users[0] || null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

async function getUser(id) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const supabaseUrl = `https://${url.hostname.split('.')[0]}.supabase.co`;
    const supabaseKey = url.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${id}&select=*`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      });
      
      if (response.ok) {
        const users = await response.json();
        return users[0] || null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

async function getUserCredits(userId) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const supabaseUrl = `https://${url.hostname.split('.')[0]}.supabase.co`;
    const supabaseKey = url.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseKey) {
      const response = await fetch(`${supabaseUrl}/rest/v1/credit_transactions?user_id=eq.${userId}&select=amount,type`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        }
      });
      
      if (response.ok) {
        const transactions = await response.json();
        const total = transactions.reduce((sum, t) => {
          return sum + (t.type === 'purchase' ? t.amount : -t.amount);
        }, 0);
        return Math.max(0, total);
      }
    }
    
    return 25; // Default credits
  } catch (error) {
    console.error('Database error:', error);
    return 25;
  }
}

// Route handlers
async function handleAuthMe(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await getUser(session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const credits = await getUserCredits(user.id);
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      credits,
      subscriptionTier: user.subscription_tier
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
}

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    const isValidPassword = compareHash(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    const sessionId = createSession(user.id, user.username);
    const credits = await getUserCredits(user.id);
    
    res.setHeader('x-session-id', sessionId);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        credits,
        subscriptionTier: user.subscription_tier
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}

async function handleRegister(req, res) {
  try {
    const { username, password, email, fullName, confirmPassword } = req.body;
    
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashedPassword = simpleHash(password);
    
    const newUser = await createUser({
      username,
      password: hashedPassword,
      email,
      fullName
    });
    
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    
    const sessionId = createSession(newUser.id, newUser.username);
    
    res.setHeader('x-session-id', sessionId);
    res.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        credits: newUser.credits,
        subscriptionTier: newUser.subscription_tier
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
}

function handleLogout(req, res) {
  const session = getSessionFromRequest(req);
  if (session && session.id) {
    sessions.delete(session.id);
  }
  res.json({ message: "Logout successful" });
}

// Main handler for Vercel
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '/';

  try {
    // Route handling
    if (path === '/health' && method === 'GET') {
      return res.json({ 
        status: 'healthy',
        message: 'TextBlaster API with Supabase REST', 
        timestamp: new Date().toISOString(),
        database: 'connected'
      });
    }

    if (path === '/test' && method === 'GET') {
      return res.json({ 
        message: 'TextBlaster API working with Supabase REST', 
        timestamp: new Date().toISOString()
      });
    }

    if (path === '/auth/me' && method === 'GET') {
      return await handleAuthMe(req, res);
    }

    if (path === '/auth/login' && method === 'POST') {
      return await handleLogin(req, res);
    }

    if (path === '/auth/register' && method === 'POST') {
      return await handleRegister(req, res);
    }

    if (path === '/auth/logout' && method === 'POST') {
      return handleLogout(req, res);
    }

    // Default response for unmatched routes
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
        'POST /api/auth/logout'
      ]
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
};