import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AuthPopup from "../auth";
import { useAuth } from "../../context/AuthContext";
import logoImage from "../../assets/logo_transparent.png";
import { currentProject } from '../../config/project';

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

  const getTabBackgroundColor = () => {
    return currentProject.id === 'animal_welfare' ? 'bg-sage-200' : 'bg-stone-100';
  };

  return (
    <>
      <nav>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex flex-row items-center">
            <img 
              src={logoImage} 
              alt={`${currentProject.title} Logo`}
              className="h-16 w-auto rounded"
            />
            <div className="mt-0.5 text-stone-900 font-supreme leading-tight text-sm -ml-2">
              <div>{currentProject.title.split(' ')[0]} {currentProject.title.split(' ')[1]}</div>
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
          <div className={"border-t border-stone-900 relative z-50"}>
            <div className="container mx-auto">
              <div className="hidden sm:block px-6">
                <button className={`py-2 px-4 text-sm transition-colors border-b-2 border-stone-900 -mb-[2px] ${getTabBackgroundColor()}`}>
                  {currentProject.currentTab}
                </button>
                <button
                  disabled
                  className="py-2 px-4 text-sm transition-colors text-stone-400 cursor-not-allowed"
                >
                  {currentProject.comingSoon}
                </button>
              </div>

              <div className="sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`w-full py-2 px-6 flex items-center justify-between ${getTabBackgroundColor()}`}
                >
                  <span className="text-sm">{currentProject.currentTab}</span>
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
                  <div className="absolute w-full border-y border-stone-900 shadow bg-white left-0 top-full z-50">
                    <div className="container mx-auto">
                      <div className="divide-y divide-stone-900">
                        <button
                          disabled
                          className="w-full text-left py-2 px-6 text-sm transition-colors text-stone-400 cursor-not-allowed"
                        >
                          {currentProject.comingSoon}
                        </button>
                      </div>
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