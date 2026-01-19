
import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE WITH YOUR SUPABASE PROJECT DETAILS
const supabaseUrl = 'https://fzlkkoyluhavippbnnbc.supabase.co';
const supabaseAnonKey = 'sb_publishable_1WlVImqAXrqo3V54odrtaQ_hnOdsBAD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
