
import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE WITH YOUR SUPABASE PROJECT DETAILS
export const supabaseUrl = 'https://fzlkkoyluhavippbnnbc.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6bGtrb3lsdWhhdmlwcGJubmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODAzMTcsImV4cCI6MjA4NDM1NjMxN30.KqUbz3YganOQMMSAiPk8fI_ZRu-OoXkvgrMP-eANqXI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
