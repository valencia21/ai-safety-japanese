import { createClient } from "@supabase/supabase-js";
import type { Database } from './types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const projectId = import.meta.env.VITE_PROJECT_ID;

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Set project context
export const initializeProject = async () => {
  try {
    await supabase.rpc('set_current_project', { p_id: projectId });
    return projectId;
  } catch (error) {
    console.error('Error setting project context:', error);
    throw error;
  }
};

// Optional: Create a wrapper if you want to ensure project is always initialized
export const getSupabase = async () => {
  await initializeProject();
  return supabase;
};