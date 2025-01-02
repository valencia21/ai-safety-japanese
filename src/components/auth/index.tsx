// src/auth/index.tsx
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white border-stone-900 border-l-2 border-t-2 px-6 pb-6 w-full max-w-md relative">
        <div className="">
          <h2 className="inline-block -ml-6 px-3 py-2 bg-stone-900 text-white text-sm">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full py-2 border-b border-stone-900 focus:outline-none focus:border-b-2"
              />
            </div>
            
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full py-2 border-b border-stone-900 focus:outline-none focus:border-b-2"
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
              className="w-full bg-stone-100 px-4 py-2 hover:bg-stone-900 hover:text-white focus:outline-none"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            {isSignUp ? (
              <button
                onClick={() => setIsSignUp(false)}
                className="text-stone-500 hover:text-stone-900"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                onClick={() => setIsSignUp(true)}
                className="text-stone-500 hover:text-stone-900"
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