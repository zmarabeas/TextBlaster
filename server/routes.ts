import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userLoginSchema, userRegisterSchema, insertClientSchema, insertMessageSchema, InsertClient } from "@shared/schema";
import bcrypt from "bcryptjs";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { handleMessageStatusUpdate, handleIncomingMessage, getMessageBatchStatus } from "./twilio/webhooks";
import { initTwilioClient, sendSms, sendBatchSms } from "./twilio/client";
import { faker } from '@faker-js/faker';
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Function to generate a test response for our simulated SMS replies
function generateTestResponse(message: string): string {
  const responses = [
    "Thanks for the info!",
    "Got it, I'll get back to you soon.",
    "Thanks for letting me know.",
    "I'll check my calendar and let you know.",
    "That works for me!",
    "Can we reschedule?",
    "Perfect, thanks!",
    "Sorry, I can't make it then.",
    "Yes, that sounds good.",
    "No, that doesn't work for me.",
    "I'll be there!",
    "Need more details please.",
    "👍",
    "👌",
    "OK",
    "Sounds good!",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Setup session storage
const SessionStore = MemoryStore(session);

// User authentication middleware
const authenticateUser = (req: Request, res: Response, next: Function) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session
  app.use(
    session({
      cookie: { 
        maxAge: 86400000,  // 24 hours
        secure: process.env.NODE_ENV === "production" 
      },
      store: new SessionStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "textblaster-secret"
    })
  );

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validData = userRegisterSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validData.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...validData,
        password: hashedPassword
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validData = userLoginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(validData.username);
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(validData.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Client routes
  app.get("/api/clients", authenticateUser, async (req, res) => {
    try {
      const clients = await storage.getClientsByUserId(req.session.userId!);
      res.json(clients);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/clients", authenticateUser, async (req, res) => {
    try {
      const validData = insertClientSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      const client = await storage.createClient(validData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Generate random clients
  app.post("/api/clients/generate-random", authenticateUser, async (req, res) => {
    try {
      const { count = 5 } = req.body; // Default to 5 clients if not specified
      
      // Generate random clients
      const clients: InsertClient[] = [];
      
      for (let i = 0; i < count; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const phone = `+1${faker.string.numeric(10)}`;
        
        const tagCount = faker.number.int({ min: 0, max: 3 });
        const tags: string[] = [];
        const allTags = ['VIP', 'Lead', 'Customer', 'Prospect', 'Inactive', 'New', 'Returning'];
        
        for (let j = 0; j < tagCount; j++) {
          const randomTag = allTags[faker.number.int({ min: 0, max: allTags.length - 1 })];
          if (!tags.includes(randomTag)) {
            tags.push(randomTag);
          }
        }
        
        clients.push({
          userId: req.session.userId!,
          firstName,
          lastName,
          phone,
          email: faker.helpers.maybe(() => faker.internet.email({ firstName, lastName }), { probability: 0.7 }),
          tags: tags.length > 0 ? tags : null,
          notes: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.5 }),
        });
      }
      
      // Create all clients in the database
      const createdClients = await Promise.all(
        clients.map(client => storage.createClient(client))
      );
      
      res.status(201).json({ 
        message: `Generated ${createdClients.length} random clients`,
        clients: createdClients
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/clients/:id", authenticateUser, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if client belongs to user
      if (client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/clients/:id", authenticateUser, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if client belongs to user
      if (client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updatedClient = await storage.updateClient(
        parseInt(req.params.id),
        req.body
      );
      
      res.json(updatedClient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/clients/:id", authenticateUser, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if client belongs to user
      if (client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteClient(parseInt(req.params.id));
      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Message routes
  app.get("/api/clients/:clientId/messages", authenticateUser, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.clientId));
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Check if client belongs to user
      if (client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const messages = await storage.getMessagesByClientId(parseInt(req.params.clientId));
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/messages", authenticateUser, async (req, res) => {
    try {
      // Validate data
      const validData = insertMessageSchema.parse({
        ...req.body,
        userId: req.session.userId
      });
      
      // Verify client exists and belongs to user
      const client = await storage.getClient(validData.clientId);
      if (!client || client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized or client not found" });
      }
      
      // Check if user has sufficient credits for outbound message
      if (validData.direction === "outbound") {
        const userCredits = await storage.getUserCredits(req.session.userId!);
        if (userCredits < 1) {
          return res.status(400).json({ message: "Insufficient credits" });
        }
        
        // Deduct credits for outbound message
        await storage.useCredits(req.session.userId!, 1, "Sent SMS message");
      }
      
      // Create message
      const message = await storage.createMessage(validData);
      
      // Update client's last contacted timestamp for outbound messages
      if (validData.direction === "outbound") {
        await storage.updateClient(validData.clientId, {
          lastContactedAt: new Date()
        });
      }
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Test message endpoint that doesn't use Twilio credits
  app.post("/api/messages/test", authenticateUser, async (req, res) => {
    try {
      // Validate data
      const validData = insertMessageSchema.parse({
        ...req.body,
        userId: req.session.userId,
        status: "delivered" // Simulate successful delivery
      });
      
      // Verify client exists and belongs to user
      const client = await storage.getClient(validData.clientId);
      if (!client || client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized or client not found" });
      }
      
      // Generate a fake Twilio SID for the message
      const twilioSid = `TEST${faker.string.alphanumeric(32)}`;
      
      // Create message with test data
      const message = await storage.createMessage({
        ...validData,
        direction: "outbound",
      });
      
      // Update the message with the test Twilio SID after creation
      await storage.updateMessageStatus(message.id, "delivered");
      
      // Update client's last contacted timestamp
      await storage.updateClient(validData.clientId, {
        lastContactedAt: new Date()
      });
      
      // Simulate a response after a random delay (1-3 seconds)
      if (Math.random() > 0.3) { // 70% chance of getting a response
        setTimeout(async () => {
          try {
            // Create a simulated response
            const responseMessage = await storage.createMessage({
              userId: req.session.userId!,
              clientId: validData.clientId,
              content: generateTestResponse(validData.content),
              direction: "inbound",
              status: "received"
            });
            
            // Update status to received 
            await storage.updateMessageStatus(responseMessage.id, "received");
          } catch (err) {
            console.error("Error creating test response:", err);
          }
        }, faker.number.int({ min: 1000, max: 3000 }));
      }
      
      res.status(201).json({
        ...message,
        test: true,
        message: "Test message created successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Message templates routes
  app.get("/api/message-templates", authenticateUser, async (req, res) => {
    try {
      const templates = await storage.getMessageTemplates(req.session.userId!);
      res.json(templates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/message-templates", authenticateUser, async (req, res) => {
    try {
      const template = await storage.createMessageTemplate({
        ...req.body,
        userId: req.session.userId!
      });
      res.status(201).json(template);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mass messaging
  app.post("/api/mass-messages", authenticateUser, async (req, res) => {
    try {
      const { clientIds, content } = req.body;
      
      if (!Array.isArray(clientIds) || clientIds.length === 0 || !content) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Check if user has sufficient credits
      const userCredits = await storage.getUserCredits(req.session.userId!);
      if (userCredits < clientIds.length) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      
      // Send messages to all clients
      const messagePromises = clientIds.map(async (clientId) => {
        const client = await storage.getClient(clientId);
        
        // Skip if client doesn't exist or doesn't belong to user
        if (!client || client.userId !== req.session.userId) {
          return null;
        }
        
        // Create message
        return storage.createMessage({
          userId: req.session.userId!,
          clientId,
          content,
          direction: "outbound",
          status: "sent"
        });
      });
      
      const messages = await Promise.all(messagePromises);
      const validMessages = messages.filter(Boolean);
      
      // Deduct credits
      await storage.useCredits(
        req.session.userId!,
        validMessages.length,
        `Sent mass message to ${validMessages.length} clients`
      );
      
      // Update clients' last contacted timestamps
      await Promise.all(
        validMessages.map(message => 
          message && storage.updateClient(message.clientId, {
            lastContactedAt: new Date()
          })
        )
      );
      
      res.status(201).json({
        sent: validMessages.length,
        messages: validMessages
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Credits routes
  app.get("/api/credits", authenticateUser, async (req, res) => {
    try {
      const credits = await storage.getUserCredits(req.session.userId!);
      res.json({ credits });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/credit-transactions", authenticateUser, async (req, res) => {
    try {
      const transactions = await storage.getCreditTransactions(req.session.userId!);
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // For development/testing: add credits to current user
  app.post("/api/credits/add", authenticateUser, async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const transaction = await storage.addCredits(
        req.session.userId!,
        amount,
        "purchase",
        "Development credit purchase"
      );
      
      res.status(201).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/dashboard", authenticateUser, async (req, res) => {
    try {
      // Get current user
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get clients
      const clients = await storage.getClientsByUserId(req.session.userId!);
      
      // Get messages (just count outbound ones for analytics)
      let messagesCount = 0;
      let responseCount = 0;
      
      for (const client of clients) {
        const messages = await storage.getMessagesByClientId(client.id);
        
        const outboundMessages = messages.filter(m => m.direction === "outbound");
        messagesCount += outboundMessages.length;
        
        // Count responses (any inbound message after an outbound one is considered a response)
        for (let i = 1; i < messages.length; i++) {
          if (messages[i].direction === "inbound" && messages[i-1].direction === "outbound") {
            responseCount++;
          }
        }
      }
      
      // Calculate response rate
      const responseRate = messagesCount > 0 
        ? Math.round((responseCount / messagesCount) * 100)
        : 0;
      
      // Get clients needing attention (not contacted in 30+ days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const clientsNeedingAttention = clients
        .filter(client => 
          !client.lastContactedAt || 
          new Date(client.lastContactedAt) < thirtyDaysAgo
        )
        .sort((a, b) => {
          // Sort by lastContactedAt (oldest first)
          const aDate = a.lastContactedAt ? new Date(a.lastContactedAt) : new Date(0);
          const bDate = b.lastContactedAt ? new Date(b.lastContactedAt) : new Date(0);
          return aDate.getTime() - bDate.getTime();
        })
        .slice(0, 10); // Limit to 10 clients
      
      // Send analytics data
      res.json({
        stats: {
          clientCount: clients.length,
          messageSent: messagesCount,
          responseRate: `${responseRate}%`,
          credits: user.credits
        },
        clientsNeedingAttention
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/recent-conversations", authenticateUser, async (req, res) => {
    try {
      // Get all clients for the user
      const clients = await storage.getClientsByUserId(req.session.userId!);
      
      // Collect the most recent message for each client
      const recentMessages = [];
      
      for (const client of clients) {
        const messages = await storage.getMessagesByClientId(client.id);
        if (messages.length > 0) {
          // Sort messages by date (newest first)
          messages.sort((a, b) => 
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          );
          
          // Add the most recent message with client info
          recentMessages.push({
            message: messages[0],
            client
          });
        }
      }
      
      // Sort by message date (newest first) and limit to 10
      recentMessages.sort((a, b) => 
        new Date(b.message.sentAt).getTime() - new Date(a.message.sentAt).getTime()
      );
      
      res.json(recentMessages.slice(0, 10));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Initialize Twilio client when the server starts
  try {
    initTwilioClient();
  } catch (error) {
    console.warn('Failed to initialize Twilio client:', error);
    console.warn('SMS sending functionality will be unavailable.');
  }

  // Twilio webhook routes
  // These routes don't need authentication as they're called by Twilio
  
  // Message status updates
  app.post("/api/twilio/status-callback", handleMessageStatusUpdate);
  
  // Incoming messages
  app.post("/api/twilio/incoming", handleIncomingMessage);
  
  // Get batch message status
  app.get("/api/message-batches/:batchId/status", authenticateUser, getMessageBatchStatus);

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { planId, amount } = req.body;
      
      // Plan configurations
      const planConfig = {
        'price_starter_800': { credits: 800, name: 'Starter' },
        'price_professional_1750': { credits: 1750, name: 'Professional' },
        'price_business_4000': { credits: 4000, name: 'Business' }
      };

      const plan = planConfig[planId as keyof typeof planConfig];
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          planId,
          credits: plan.credits.toString(),
          planName: plan.name
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Handle successful payment and create account
  app.post("/api/payment-success", async (req, res) => {
    try {
      const { paymentIntentId, userData } = req.body;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not successful" });
      }

      // Extract plan info from metadata
      const planCredits = parseInt(paymentIntent.metadata.credits);
      const planName = paymentIntent.metadata.planName;
      
      // Create user account with credits
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await storage.createUser({
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        fullName: userData.fullName,
        credits: planCredits,
        subscriptionTier: planName.toLowerCase()
      });

      // Create credit transaction record
      await storage.addCredits(
        newUser.id, 
        planCredits, 
        'purchase', 
        `${planName} plan purchase`,
        paymentIntentId
      );

      // Set session
      req.session.userId = newUser.id;
      req.session.username = newUser.username;

      res.json({ 
        message: "Account created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName,
          credits: newUser.credits,
          subscriptionTier: newUser.subscriptionTier
        }
      });
    } catch (error: any) {
      console.error("Error processing payment success:", error);
      res.status(500).json({ message: "Error creating account: " + error.message });
    }
  });
  
  // Send SMS via Twilio
  app.post("/api/send-sms", authenticateUser, async (req, res) => {
    try {
      const { clientId, content } = req.body;
      
      if (!clientId || !content) {
        return res.status(400).json({ message: "Client ID and message content are required" });
      }
      
      // Verify client exists and belongs to user
      const client = await storage.getClient(clientId);
      if (!client || client.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized or client not found" });
      }
      
      // Check if user has sufficient credits
      const userCredits = await storage.getUserCredits(req.session.userId!);
      if (userCredits < 1) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      
      // Create message in pending state
      const message = await storage.createMessage({
        userId: req.session.userId!,
        clientId,
        content,
        direction: "outbound",
        status: "queued"
      });
      
      // Build the status callback URL
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const statusCallback = `${baseUrl}/api/twilio/status-callback`;
      
      // Send the SMS
      const twilioResponse = await sendSms(
        client.phone,
        content,
        statusCallback
      );
      
      if (!twilioResponse) {
        // Update message status to failed
        await storage.updateMessageStatus(message.id, "failed");
        return res.status(500).json({ message: "Failed to send SMS" });
      }
      
      // Update message with Twilio SID
      const updatedMessage = await storage.updateMessageStatus(message.id, "sent");
      await storage.getMessageByTwilioSid(twilioResponse.sid);
      
      // Deduct credits
      await storage.useCredits(req.session.userId!, 1, "Sent SMS message");
      
      // Update client's last contacted timestamp
      await storage.updateClient(clientId, {
        lastContactedAt: new Date()
      });
      
      res.status(200).json({
        success: true,
        message: updatedMessage
      });
    } catch (error) {
      console.error("Error sending SMS:", error);
      res.status(500).json({ message: "Failed to send SMS" });
    }
  });
  
  // Send mass SMS via Twilio
  app.post("/api/send-mass-sms", authenticateUser, async (req, res) => {
    try {
      const { clientIds, content } = req.body;
      
      if (!Array.isArray(clientIds) || clientIds.length === 0 || !content) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Check if user has sufficient credits
      const userCredits = await storage.getUserCredits(req.session.userId!);
      if (userCredits < clientIds.length) {
        return res.status(400).json({ message: "Insufficient credits" });
      }
      
      // Build the status callback URL
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const statusCallback = `${baseUrl}/api/twilio/status-callback`;
      
      // Prepare messages for each client
      const messageData = [];
      const validClients = [];
      
      for (const clientId of clientIds) {
        const client = await storage.getClient(clientId);
        
        // Skip if client doesn't exist or doesn't belong to user
        if (!client || client.userId !== req.session.userId) {
          continue;
        }
        
        messageData.push({
          userId: req.session.userId!,
          clientId,
          content,
          direction: "outbound",
          status: "queued"
        });
        
        validClients.push(client);
      }
      
      // Create messages in a batch
      const { batchId, messages } = await storage.createMessageBatch(
        req.session.userId!,
        messageData
      );
      
      // Deduct credits
      await storage.useCredits(
        req.session.userId!,
        messages.length,
        `Sent mass message to ${messages.length} clients`
      );
      
      // Update clients' last contacted timestamps
      for (const client of validClients) {
        await storage.updateClient(client.id, {
          lastContactedAt: new Date()
        });
      }
      
      // Start sending messages in batches in the background
      // This prevents the request from timing out for large batches
      sendBatchSms(
        validClients.map((client, index) => ({
          to: client.phone,
          body: content,
          messageId: messages[index].id
        })),
        statusCallback
      ).catch(error => {
        console.error("Error sending batch SMS:", error);
      });
      
      res.status(200).json({
        success: true,
        batchId,
        totalMessages: messages.length
      });
    } catch (error) {
      console.error("Error sending mass SMS:", error);
      res.status(500).json({ message: "Failed to send mass SMS" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
