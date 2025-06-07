import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables or use default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
