// src/auth/index.tsx
import { X } from 'lucide-react';
import { useState, FormEvent } from "react";
import { useAuth } from './useAuth';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPopup = ({ isOpen, onClose }: AuthPopupProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, message, handleSignUp, handleSignIn } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await handleSignUp(email, password);
      } else {
        await handleSignIn(email, password);
        onClose();
      }
    } catch (error) {
      // Error is already handled in useAuth
      console.error('Auth error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            {message && (
              <div className="text-green-500 text-sm">{message}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-sm">
            {isSignUp ? (
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-500 hover:text-blue-600"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                Don't have an account? Sign up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;