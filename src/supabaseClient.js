
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Defensive check: Only create client if both URL and Key are present
// This prevents top-level crashes when environment variables are missing
export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

if (!supabase) {
    console.error('CRITICAL: Supabase environment variables (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY) are missing.');
}
