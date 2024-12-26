import React, { useState } from "react";
import AuthPopup from "../auth";
import { useAuth } from "../../context/AuthContext";

export const Navbar: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <nav className="bg-stone-300">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center sm:pl-6 p-4">
          <div className="flex items-center gap-2">
            <div className="text-stone-900">aisafetynotes.jp</div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-stone-700">
                {user.email}
              </span>
            )}
            <button
              onClick={handleAuth}
              className="px-4 py-2 text-sm font-medium text-stone-900 hover:bg-stone-100 rounded-lg"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto flex px-6">
            <button
              className="py-2 px-4 text-sm font-medium transition-colors border-b-2 border-stone-900 bg-stone-100"
            >
              AI Safety Fundamentals: Alignment
            </button>
            <button
              disabled
              className="py-2 px-4 text-sm font-medium transition-colors text-stone-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </nav>
      
      <AuthPopup 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};