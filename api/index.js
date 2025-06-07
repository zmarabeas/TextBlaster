// Simple session store for serverless
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

function simpleHash(password) {
  return Buffer.from(password + 'textblaster_salt').toString('base64');
}

function compareHash(password, hash) {
  return Buffer.from(password + 'textblaster_salt').toString('base64') === hash;
}

// Supabase REST API helper
async function supabaseRequest(endpoint, options = {}) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not configured');
  }
  
  // Parse Supabase connection details from DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL);
  const projectRef = dbUrl.hostname.split('.')[0];
  const supabaseUrl = `https://${projectRef}.supabase.co`;
  
  // Try to extract API key from URL or use environment variable
  let apiKey = dbUrl.searchParams.get('apikey') || process.env.SUPABASE_ANON_KEY;
  
  // If no API key found, try common Supabase patterns
  if (!apiKey) {
    // Extract from password field (common in some Supabase connection strings)
    const password = dbUrl.password;
    if (password && password.startsWith('eyJ')) {
      apiKey = password;
    }
  }
  
  if (!apiKey) {
    throw new Error('Supabase API key not found in DATABASE_URL or SUPABASE_ANON_KEY');
  }
  
  const response = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'apikey': apiKey,
      ...options.headers
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Supabase request failed: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Database request failed: ${response.statusText}`);
  }
  
  return await response.json();
}

// Database operations using Supabase REST API
async function getUserByUsername(username) {
  try {
    const users = await supabaseRequest(`users?username=eq.${encodeURIComponent(username)}&select=*`);
    return users[0] || null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

async function createUser(userData) {
  try {
    const { username, password, email, fullName } = userData;
    
    const users = await supabaseRequest('users', {
      method: 'POST',
      headers: {
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
    
    return users[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

async function getUser(id) {
  try {
    const users = await supabaseRequest(`users?id=eq.${id}&select=*`);
    return users[0] || null;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }
}

async function getUserCredits(userId) {
  try {
    const transactions = await supabaseRequest(`credit_transactions?user_id=eq.${userId}&select=amount,type`);
    const total = transactions.reduce((sum, t) => {
      return sum + (t.type === 'purchase' ? t.amount : -t.amount);
    }, 0);
    return Math.max(0, total);
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 25; // Default credits
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
      const hasDbUrl = !!process.env.DATABASE_URL;
      return res.json({ 
        status: 'healthy',
        message: 'TextBlaster API with Supabase', 
        timestamp: new Date().toISOString(),
        database: hasDbUrl ? 'connected' : 'not configured'
      });
    }

    if (path === '/test' && method === 'GET') {
      return res.json({ 
        message: 'TextBlaster API working with Supabase', 
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