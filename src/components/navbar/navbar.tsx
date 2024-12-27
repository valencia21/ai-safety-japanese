import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AuthPopup from "../auth";
import { useAuth } from "../../context/AuthContext";
import logoImage from "../../assets/logo_transparent.png";

export const Navbar: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <nav className="">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex flex-row items-center">
            <img 
              src={logoImage} 
              alt="AI Safety Notes Logo" 
              className="h-16 w-auto rounded"
            />
            <div className="mt-0.5 text-stone-900 font-supreme leading-tight text-sm -ml-2">
              <div>AI Safety</div>
              <div className="-mt-0.5">Notes</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:inline text-sm text-stone-700">
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

        {isHomePage && (
          <div className="border-y border-stone-200">
            <div className="container mx-auto px-6">
              <div className="hidden sm:block">
                <button
                  className="py-2 px-4 text-sm transition-colors border-b-2 -mb-[2px] border-stone-900 bg-stone-100"
                >
                  AI Safety Fundamentals: Alignment
                </button>
                <button
                  disabled
                  className="py-2 px-4 text-sm transition-colors text-stone-400 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>

              <div className="sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="py-2 flex items-center"
                >
                  <span className="text-sm mr-2">AI Safety Fundamentals: Alignment</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="absolute z-50 w-full left-0 bg-white border-b border-stone-200">
                    <div className="container mx-auto px-6">
                      <button
                        className="w-full text-left py-2 px-4 text-sm transition-colors hover:bg-stone-100"
                      >
                        AI Safety Fundamentals: Alignment
                      </button>
                      <button
                        disabled
                        className="w-full text-left py-2 px-4 text-sm transition-colors text-stone-400 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <AuthPopup 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};