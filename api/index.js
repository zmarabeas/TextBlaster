const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { eq, desc, sql } = require('drizzle-orm');
const { pgTable, serial, text, integer, timestamp, boolean } = require('drizzle-orm/pg-core');
const { createInsertSchema } = require('drizzle-zod');
const { z } = require('zod');

// Database schema definitions
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  credits: integer("credits").default(0),
  subscriptionTier: text("subscription_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  tags: text("tags").array(),
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  clientId: integer("client_id"),
  twilioSid: text("twilio_sid"),
  content: text("content").notNull(),
  direction: text("direction").notNull(),
  status: text("status").notNull(),
  batchId: text("batch_id"),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Schema validation
const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

const userLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const userRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const db = drizzle(pool);

// Create Express app for handling all routes
const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Simple session store for serverless (in production, use Redis or similar)
const sessions = new Map();

// Custom session middleware for serverless
const sessionMiddleware = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '') || 
                    req.cookies?.sessionId || 
                    req.headers['x-session-id'];
  
  if (sessionId && sessions.has(sessionId)) {
    req.session = sessions.get(sessionId);
  } else {
    req.session = {};
  }
  
  // Save session function
  req.session.save = (callback) => {
    if (!req.session.id) {
      req.session.id = Math.random().toString(36).substr(2, 9);
    }
    sessions.set(req.session.id, req.session);
    res.setHeader('x-session-id', req.session.id);
    if (callback) callback();
  };
  
  next();
};

app.use(sessionMiddleware);

// Authentication middleware
const authenticateUser = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Storage functions
const storage = {
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  },

  async createUser(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  },

  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  },

  async getClientsByUserId(userId) {
    return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  },

  async createClient(clientData) {
    const result = await db.insert(clients).values(clientData).returning();
    return result[0];
  },

  async getUserCredits(userId) {
    const result = await db.select({ 
      totalCredits: sql`COALESCE(SUM(CASE WHEN ${creditTransactions.type} = 'purchase' THEN ${creditTransactions.amount} ELSE -${creditTransactions.amount} END), 0)`
    }).from(creditTransactions).where(eq(creditTransactions.userId, userId));
    return Number(result[0]?.totalCredits) || 0;
  },

  async updateClient(id, data) {
    const result = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return result[0];
  },

  async deleteClient(id) {
    await db.delete(clients).where(eq(clients.id, id));
    return true;
  },

  async getMessagesByUserId(userId) {
    return await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(desc(messages.createdAt));
  },

  async createMessage(messageData) {
    const result = await db.insert(messages).values(messageData).returning();
    return result[0];
  },

  async getMessageTemplates(userId) {
    return await db.select().from(messageTemplates).where(eq(messageTemplates.userId, userId)).orderBy(desc(messageTemplates.createdAt));
  },

  async createMessageTemplate(templateData) {
    const result = await db.insert(messageTemplates).values(templateData).returning();
    return result[0];
  },

  async addCredits(userId, amount, type, description) {
    const result = await db.insert(creditTransactions).values({
      userId,
      amount,
      type,
      description
    }).returning();
    return result[0];
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    message: 'TextBlaster API is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Authentication routes
app.get('/auth/me', authenticateUser, async (req, res) => {
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const credits = await storage.getUserCredits(user.id);
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      credits,
      subscriptionTier: user.subscriptionTier
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const loginData = userLoginSchema.parse(req.body);
    
    const user = await storage.getUserByUsername(loginData.username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    const isValidPassword = await bcryptjs.compare(loginData.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.save();
    
    const credits = await storage.getUserCredits(user.id);
    
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        credits,
        subscriptionTier: user.subscriptionTier
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const userData = userRegisterSchema.parse(req.body);
    
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    
    const newUser = await storage.createUser({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      fullName: userData.fullName,
      credits: 25, // Free plan credits
      subscriptionTier: 'free'
    });
    
    req.session.userId = newUser.id;
    req.session.username = newUser.username;
    req.session.save();
    
    res.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        credits: newUser.credits,
        subscriptionTier: newUser.subscriptionTier
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post('/auth/logout', (req, res) => {
  if (req.session.id) {
    sessions.delete(req.session.id);
  }
  res.json({ message: "Logout successful" });
});

// Client routes
app.get('/clients', authenticateUser, async (req, res) => {
  try {
    const userClients = await storage.getClientsByUserId(req.session.userId);
    res.json(userClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Error fetching clients" });
  }
});

app.post('/clients', authenticateUser, async (req, res) => {
  try {
    const clientData = insertClientSchema.parse(req.body);
    const newClient = await storage.createClient({
      ...clientData,
      userId: req.session.userId
    });
    res.json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Error creating client" });
  }
});

app.put('/clients/:id', authenticateUser, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const updateData = insertClientSchema.partial().parse(req.body);
    const updatedClient = await storage.updateClient(clientId, updateData);
    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Error updating client" });
  }
});

app.delete('/clients/:id', authenticateUser, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    await storage.deleteClient(clientId);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
});

// Message routes
app.get('/messages', authenticateUser, async (req, res) => {
  try {
    const userMessages = await storage.getMessagesByUserId(req.session.userId);
    res.json(userMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post('/messages/send', authenticateUser, async (req, res) => {
  try {
    const { clientId, content } = req.body;
    
    if (!clientId || !content) {
      return res.status(400).json({ message: "Client ID and message content are required" });
    }
    
    // Check if user has sufficient credits
    const userCredits = await storage.getUserCredits(req.session.userId);
    if (userCredits < 1) {
      return res.status(400).json({ message: "Insufficient credits" });
    }
    
    // Create message
    const message = await storage.createMessage({
      userId: req.session.userId,
      clientId,
      content,
      direction: "outbound",
      status: "sent"
    });
    
    // Deduct credits (for demo - in production would integrate with Twilio)
    await storage.addCredits(req.session.userId, -1, "usage", "Sent SMS message");
    
    res.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Message template routes
app.get('/message-templates', authenticateUser, async (req, res) => {
  try {
    const templates = await storage.getMessageTemplates(req.session.userId);
    res.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Error fetching templates" });
  }
});

app.post('/message-templates', authenticateUser, async (req, res) => {
  try {
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ message: "Name and content are required" });
    }
    
    const template = await storage.createMessageTemplate({
      userId: req.session.userId,
      name,
      content
    });
    
    res.json(template);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Error creating template" });
  }
});

// Credits route
app.get('/credits', authenticateUser, async (req, res) => {
  try {
    const credits = await storage.getUserCredits(req.session.userId);
    res.json({ credits });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({ message: "Error fetching credits" });
  }
});

app.post('/credits/purchase', authenticateUser, async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }
    
    // For demo purposes - in production would integrate with Stripe
    await storage.addCredits(req.session.userId, amount, "purchase", description || "Credit purchase");
    
    const newCredits = await storage.getUserCredits(req.session.userId);
    res.json({ message: "Credits added successfully", credits: newCredits });
  } catch (error) {
    console.error("Error purchasing credits:", error);
    res.status(500).json({ message: "Error purchasing credits" });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'TextBlaster API is working', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Export handler for Vercel
module.exports = (req, res) => {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-id');
  res.setHeader('Access-Control-Expose-Headers', 'x-session-id');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Pass request to Express app
  app(req, res);
};