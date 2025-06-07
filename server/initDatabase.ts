import { createSupabaseConnection, createTables } from './supabaseConnection';

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('[database] No DATABASE_URL found, using in-memory storage');
    return false;
  }

  try {
    console.log('[database] Connecting to Supabase...');
    const db = await createSupabaseConnection();
    await createTables(db);
    
    console.log('[database] Supabase database initialized successfully');
    return true;
  } catch (error) {
    console.error('[database] Failed to connect to Supabase:', error);
    return false;
  }
}