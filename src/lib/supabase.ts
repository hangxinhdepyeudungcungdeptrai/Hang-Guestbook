import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are fully configured
export const hasSupabase = !!(supabaseUrl && supabaseAnonKey);

if (!hasSupabase) {
  console.warn(
    'Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing. ' +
    'The guestbook will operate in local storage fallback mode.'
  );
}

// Initialize client with fallback placeholder to prevent app crash on launch
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-only-for-initialization.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
