import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function createSupabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Test the connection
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[database] Successfully connected to Supabase');
    
    return drizzle(pool);
  } catch (error) {
    console.error('[database] Failed to connect to Supabase:', error);
    await pool.end();
    throw error;
  }
}

export async function createTables(db: ReturnType<typeof drizzle>) {
  try {
    console.log('[database] Creating tables...');
    
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        credits INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        stripe_customer_id VARCHAR(255),
        stripe_subscription_id VARCHAR(255),
        subscription_tier VARCHAR(50) DEFAULT 'free'
      )
    `);

    // Create clients table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        tags TEXT[],
        notes TEXT,
        last_contacted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create messages table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        direction VARCHAR(20) NOT NULL DEFAULT 'outbound',
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        twilio_sid VARCHAR(255),
        batch_id VARCHAR(255),
        error_code VARCHAR(50),
        error_message TEXT,
        sent_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create message_templates table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS message_templates (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create credit_transactions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        stripe_payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('[database] All tables created successfully');
    return true;
  } catch (error) {
    console.error('[database] Failed to create tables:', error);
    throw error;
  }
}