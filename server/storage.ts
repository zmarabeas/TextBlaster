import { 
  User, InsertUser, 
  Client, InsertClient, 
  Message, InsertMessage, 
  MessageTemplate, InsertMessageTemplate,
  CreditTransaction, InsertCreditTransaction,
  users, clients, messages, messageTemplates, creditTransactions
} from "@shared/schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import postgres from 'postgres';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { createSupabaseConnection } from './supabaseConnection';

// Storage interface for all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getClientsByUserId(userId: number): Promise<Client[]>;
  getClientsByPhoneNumber(phoneNumber: string): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, data: Partial<Client>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  getClientsByTags(userId: number, tags: string[]): Promise<Client[]>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessageByTwilioSid(twilioSid: string): Promise<Message | undefined>;
  getMessagesByClientId(clientId: number): Promise<Message[]>;
  getMessagesByBatchId(batchId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: string): Promise<Message | undefined>;
  updateMessageError(id: number, errorDetails: { errorCode: string, errorMessage: string }): Promise<Message | undefined>;
  createMessageBatch(userId: number, messages: InsertMessage[]): Promise<{ batchId: string, messages: Message[] }>;
  
  // Message template operations
  getMessageTemplates(userId: number): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: number, data: Partial<MessageTemplate>): Promise<MessageTemplate | undefined>;
  deleteMessageTemplate(id: number): Promise<boolean>;
  
  // Credit operations
  addCredits(userId: number, amount: number, type: string, description?: string, stripePaymentId?: string): Promise<CreditTransaction>;
  useCredits(userId: number, amount: number, description?: string): Promise<CreditTransaction>;
  getUserCredits(userId: number): Promise<number>;
  getCreditTransactions(userId: number): Promise<CreditTransaction[]>;
  updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<User>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private messages: Map<number, Message>;
  private messageTemplates: Map<number, MessageTemplate>;
  private creditTransactions: Map<number, CreditTransaction>;
  private userIdCounter: number;
  private clientIdCounter: number;
  private messageIdCounter: number;
  private templateIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.messages = new Map();
    this.messageTemplates = new Map();
    this.creditTransactions = new Map();
    this.userIdCounter = 1;
    this.clientIdCounter = 1;
    this.messageIdCounter = 1;
    this.templateIdCounter = 1;
    this.transactionIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
      credits: 10, // Default starter credits
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: "free"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      updatedAt: new Date() 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: stripeInfo.customerId,
      subscriptionTier: 'premium',  // Assume premium tier when subscription is added
      updatedAt: new Date() 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientsByUserId(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId
    );
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const now = new Date();
    const client: Client = {
      ...clientData,
      id,
      createdAt: now,
      updatedAt: now,
      lastContactedAt: null,
      email: clientData.email ?? null,
      tags: clientData.tags ?? null,
      notes: clientData.notes ?? null
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, data: Partial<Client>): Promise<Client | undefined> {
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...data, updatedAt: new Date() };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  async getClientsByTags(userId: number, tags: string[]): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.userId === userId && 
      client.tags && 
      tags.some(tag => client.tags?.includes(tag))
    );
  }
  
  async getClientsByPhoneNumber(phoneNumber: string): Promise<Client[]> {
    // Clean the phone number for comparison (remove spaces, dashes, etc)
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    
    return Array.from(this.clients.values()).filter(client => {
      // Clean the client phone number for comparison
      const cleanedClientPhone = client.phone.replace(/\D/g, '');
      
      // Check if the last digits match (to handle country code differences)
      return cleanedClientPhone.endsWith(cleanedPhone) || 
             cleanedPhone.endsWith(cleanedClientPhone);
    });
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByClientId(clientId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.clientId === clientId
    ).sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = {
      ...messageData,
      id,
      sentAt: now,
      twilioSid: null,
      errorCode: null,
      errorMessage: null,
      mediaUrls: null,
      batchId: messageData.batchId || null
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessageByTwilioSid(twilioSid: string): Promise<Message | undefined> {
    return Array.from(this.messages.values()).find(
      (message) => message.twilioSid === twilioSid
    );
  }
  
  async getMessagesByBatchId(batchId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.batchId === batchId
    );
  }
  
  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, status };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async updateMessageError(id: number, errorDetails: { errorCode: string, errorMessage: string }): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage = { 
      ...message, 
      status: 'failed',
      errorCode: errorDetails.errorCode,
      errorMessage: errorDetails.errorMessage
    };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  async createMessageBatch(userId: number, messages: InsertMessage[]): Promise<{ batchId: string, messages: Message[] }> {
    // Generate a batch ID
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create all messages with the same batch ID
    const createdMessages: Message[] = [];
    
    for (const messageData of messages) {
      const message = await this.createMessage({
        ...messageData,
        batchId
      });
      createdMessages.push(message);
    }
    
    return {
      batchId,
      messages: createdMessages
    };
  }

  // Message template operations
  async getMessageTemplates(userId: number): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values()).filter(
      (template) => template.userId === userId
    );
  }

  async createMessageTemplate(templateData: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = this.templateIdCounter++;
    const now = new Date();
    const template: MessageTemplate = {
      ...templateData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.messageTemplates.set(id, template);
    return template;
  }

  async updateMessageTemplate(
    id: number, 
    data: Partial<MessageTemplate>
  ): Promise<MessageTemplate | undefined> {
    const template = this.messageTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...data, updatedAt: new Date() };
    this.messageTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteMessageTemplate(id: number): Promise<boolean> {
    return this.messageTemplates.delete(id);
  }

  // Credit operations
  async addCredits(
    userId: number, 
    amount: number, 
    type: string, 
    description?: string, 
    stripePaymentId?: string
  ): Promise<CreditTransaction> {
    // Update user's credit balance
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    await this.updateUser(userId, { credits: user.credits + amount });
    
    // Create transaction record
    const id = this.transactionIdCounter++;
    const transaction: CreditTransaction = {
      id,
      userId,
      amount,
      type,
      description: description || "",
      stripePaymentId: stripePaymentId || null,
      createdAt: new Date()
    };
    
    this.creditTransactions.set(id, transaction);
    return transaction;
  }

  async useCredits(
    userId: number, 
    amount: number, 
    description?: string
  ): Promise<CreditTransaction> {
    // Check if user has enough credits
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    if (user.credits < amount) throw new Error("Insufficient credits");
    
    // Update user's credit balance
    await this.updateUser(userId, { credits: user.credits - amount });
    
    // Create transaction record
    const id = this.transactionIdCounter++;
    const transaction: CreditTransaction = {
      id,
      userId,
      amount: -amount,
      type: "usage",
      description: description || "Message credit usage",
      stripePaymentId: null,
      createdAt: new Date()
    };
    
    this.creditTransactions.set(id, transaction);
    return transaction;
  }

  async getUserCredits(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user?.credits || 0;
  }

  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return Array.from(this.creditTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// PostgreSQL storage implementation using node-postgres
export class PostgreSQLStorage implements IStorage {
  private db: ReturnType<typeof drizzleNode>;

  constructor() {
    // This will be initialized async
    this.db = null as any;
  }

  async initialize() {
    this.db = await createSupabaseConnection();
    return this;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const result = await this.db.update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserStripeInfo(userId: number, stripeInfo: { customerId: string, subscriptionId: string }): Promise<User> {
    const result = await this.db.update(users)
      .set({ 
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId 
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    const result = await this.db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async getClientsByUserId(userId: number): Promise<Client[]> {
    return await this.db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const result = await this.db.insert(clients).values(clientData).returning();
    return result[0];
  }

  async updateClient(id: number, data: Partial<Client>): Promise<Client | undefined> {
    const result = await this.db.update(clients).set(data).where(eq(clients.id, id)).returning();
    return result[0];
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await this.db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  async getClientsByTags(userId: number, tags: string[]): Promise<Client[]> {
    // Note: This would need a proper array overlap query in PostgreSQL
    // For now, we'll return all clients and filter in memory
    const allClients = await this.getClientsByUserId(userId);
    return allClients.filter(client => 
      client.tags && client.tags.some(tag => tags.includes(tag))
    );
  }

  async getClientsByPhoneNumber(phoneNumber: string): Promise<Client[]> {
    return await this.db.select().from(clients).where(eq(clients.phone, phoneNumber));
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const result = await this.db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result[0];
  }

  async getMessagesByClientId(clientId: number): Promise<Message[]> {
    return await this.db.select().from(messages)
      .where(eq(messages.clientId, clientId))
      .orderBy(desc(messages.sentAt));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const result = await this.db.insert(messages).values(messageData).returning();
    return result[0];
  }

  async getMessageByTwilioSid(twilioSid: string): Promise<Message | undefined> {
    const result = await this.db.select().from(messages)
      .where(eq(messages.twilioSid, twilioSid))
      .limit(1);
    return result[0];
  }

  async getMessagesByBatchId(batchId: string): Promise<Message[]> {
    return await this.db.select().from(messages)
      .where(eq(messages.batchId, batchId))
      .orderBy(desc(messages.sentAt));
  }

  async updateMessageStatus(id: number, status: string): Promise<Message | undefined> {
    const result = await this.db.update(messages)
      .set({ status })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async updateMessageError(id: number, errorDetails: { errorCode: string, errorMessage: string }): Promise<Message | undefined> {
    const result = await this.db.update(messages)
      .set({ 
        errorCode: errorDetails.errorCode,
        errorMessage: errorDetails.errorMessage 
      })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async createMessageBatch(userId: number, messageList: InsertMessage[]): Promise<{ batchId: string, messages: Message[] }> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const messagesWithBatch = messageList.map(msg => ({ ...msg, batchId }));
    
    const result = await this.db.insert(messages).values(messagesWithBatch).returning();
    return { batchId, messages: result };
  }

  // Message template operations
  async getMessageTemplates(userId: number): Promise<MessageTemplate[]> {
    return await this.db.select().from(messageTemplates)
      .where(eq(messageTemplates.userId, userId))
      .orderBy(desc(messageTemplates.createdAt));
  }

  async createMessageTemplate(templateData: InsertMessageTemplate): Promise<MessageTemplate> {
    const result = await this.db.insert(messageTemplates).values(templateData).returning();
    return result[0];
  }

  async updateMessageTemplate(id: number, data: Partial<MessageTemplate>): Promise<MessageTemplate | undefined> {
    const result = await this.db.update(messageTemplates)
      .set(data)
      .where(eq(messageTemplates.id, id))
      .returning();
    return result[0];
  }

  async deleteMessageTemplate(id: number): Promise<boolean> {
    const result = await this.db.delete(messageTemplates)
      .where(eq(messageTemplates.id, id))
      .returning();
    return result.length > 0;
  }

  // Credit operations
  async addCredits(userId: number, amount: number, type: string, description?: string, stripePaymentId?: string): Promise<CreditTransaction> {
    const transactionData: InsertCreditTransaction = {
      userId,
      amount,
      type,
      description: description || `Added ${amount} credits`,
      stripePaymentId
    };
    
    const result = await this.db.insert(creditTransactions).values(transactionData).returning();
    return result[0];
  }

  async useCredits(userId: number, amount: number, description?: string): Promise<CreditTransaction> {
    const transactionData: InsertCreditTransaction = {
      userId,
      amount: -amount,
      type: 'usage',
      description: description || `Used ${amount} credits`
    };
    
    const result = await this.db.insert(creditTransactions).values(transactionData).returning();
    return result[0];
  }

  async getUserCredits(userId: number): Promise<number> {
    const transactions = await this.db.select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId));
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  async getCreditTransactions(userId: number): Promise<CreditTransaction[]> {
    return await this.db.select().from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt));
  }
}

// Initialize storage with fallback handling
let storageInstance: IStorage;

async function initStorage(): Promise<IStorage> {
  if (process.env.DATABASE_URL) {
    try {
      const pgStorage = new PostgreSQLStorage();
      await pgStorage.initialize();
      console.log('[storage] Using PostgreSQL storage with Supabase');
      return pgStorage;
    } catch (error) {
      console.log('[storage] PostgreSQL connection failed, falling back to memory storage');
      console.log('[storage] Error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  console.log('[storage] Using in-memory storage');
  return new MemStorage();
}

// Initialize storage on startup
storageInstance = new MemStorage();
initStorage().then(storage => {
  storageInstance = storage;
});

export const storage = new Proxy({} as IStorage, {
  get(target, prop) {
    return (storageInstance as any)[prop];
  }
});
