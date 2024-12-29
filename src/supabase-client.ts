import { createClient } from "@supabase/supabase-js";
import type { Database } from './types/database.types';
import { currentProject } from './config/project';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-project-id': currentProject.id
    }
  }
});

// Set project context using auth.setSession
export const initializeProject = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  await supabase.auth.setSession({
    ...session,
    access_token: session?.access_token ?? '',
    refresh_token: session?.refresh_token ?? '',
  });
  
  return currentProject.id;
};

// Optional: Create a wrapper if you want to ensure project is always initialized
export const getSupabase = async () => {
  await initializeProject();
  return supabase;
};