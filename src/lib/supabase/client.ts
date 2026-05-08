import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

console.log('[DEBUG] env check:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey, allEnv: import.meta.env });

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase environment variables. URL=${supabaseUrl}, KEY=${supabaseAnonKey ? 'SET' : 'MISSING'}. Check your .env file.`,
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
