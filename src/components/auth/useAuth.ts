// src/auth/useAuth.ts
import { useState } from "react";
import { AuthError } from '@supabase/supabase-js';
import { supabase } from "../../supabase-client";
import { currentProject, ProjectId } from '../../config/project';

const redirectUrls: Record<ProjectId, string> = {
  ai_safety: 'https://aisafetynotes.jp',
  animal_welfare: 'https://animalwelfarenotes.jp'
};

interface UseAuthReturn {
  error: string;
  message: string;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleSignIn: (email: string, password: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const handleSignUp = async (email: string, password: string) => {
    clearMessages();
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrls[currentProject.id],
          data: {
            initial_project_id: currentProject.id,  // Record which project they signed up through
            signup_date: new Date().toISOString(),  // Optionally track signup date
            last_used_project: currentProject.id    // Track most recently used project
          }
        }
      });
      
      if (error) throw error;
      
      setMessage('Check your email for the confirmation link!');
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    clearMessages();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      setError(authError.message);
      throw error;
    }
  };

  return {
    error,
    message,
    handleSignUp,
    handleSignIn,
    clearMessages
  };
};