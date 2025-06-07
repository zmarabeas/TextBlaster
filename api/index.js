const bcryptjs = require('bcryptjs');
const { Pool } = require('pg');

// Simple in-memory session store for demo
const sessions = new Map();

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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

function validateInput(data, required) {
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }
}

async function hashPassword(password) {
  return await bcryptjs.hash(password, 10);
}

async function comparePassword(password, hash) {
  return await bcryptjs.compare(password, hash);
}

// Database operations
async function getUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
  return result.rows[0];
}

async function createUser(userData) {
  const { username, password, email, fullName } = userData;
  const result = await pool.query(
    'INSERT INTO users (username, password, email, full_name, credits, subscription_tier, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
    [username, password, email, fullName, 25, 'free']
  );
  return result.rows[0];
}

async function getUser(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0];
}

async function getUserCredits(userId) {
  const result = await pool.query(
    'SELECT COALESCE(SUM(CASE WHEN type = \'purchase\' THEN amount ELSE -amount END), 0) as total_credits FROM credit_transactions WHERE user_id = $1',
    [userId]
  );
  return Number(result.rows[0]?.total_credits) || 0;
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
    
    const isValidPassword = await comparePassword(password, user.password);
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
    
    validateInput(req.body, ['username', 'password', 'email', 'fullName']);
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashedPassword = await hashPassword(password);
    
    const newUser = await createUser({
      username,
      password: hashedPassword,
      email,
      fullName
    });
    
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
        message: 'TextBlaster API is running', 
        timestamp: new Date().toISOString(),
        environment: 'production'
      });
    }

    if (path === '/test' && method === 'GET') {
      return res.json({ 
        message: 'TextBlaster API is working', 
        timestamp: new Date().toISOString(),
        environment: 'production'
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
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};