import { useState } from "react";
import { useLocation, Link } from "@tanstack/react-router";
import { useAtom } from 'jotai';
import { currentProject } from '~/config/project';
import { activeTabAtom } from '~/state-manager';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const getTabBackgroundColor = () => {
    return currentProject.id === 'animal_welfare' ? 'bg-sage-200' : 'bg-stone-100';
  };

  return (
    <>
      <nav>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex flex-row items-center">
            <img
              src="/assets/logo_transparent.png"
              alt={`${currentProject.title} Logo`}
              className="h-16 w-auto"
            />
            <div className="mt-0.5 text-stone-900 font-supreme leading-tight text-sm -ml-2">
              <div>{currentProject.title.split(' ')[0]} {currentProject.title.split(' ')[1]}</div>
              <div className="-mt-0.5">Notes</div>
            </div>
          </Link>

        </div>

        {isHomePage && (
          <div className={"border-t border-b border-stone-900 relative z-50"}>
            <div className="container mx-auto">
              <div className="hidden sm:block px-6">
                {currentProject.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-4 text-sm transition-colors ${
                      activeTab === tab.id
                        ? `border-b-2 border-stone-900 -mb-[2px] ${getTabBackgroundColor()}`
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`w-full py-2 px-6 flex items-center justify-between ${getTabBackgroundColor()}`}
                >
                  <span className="text-sm">{currentProject.tabs.find(t => t.id === activeTab)?.label}</span>
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
                        {currentProject.tabs
                          .filter(tab => tab.id !== activeTab)
                          .map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => { setActiveTab(tab.id); setIsMenuOpen(false); }}
                              className="w-full text-left py-2 px-6 text-sm transition-colors hover:bg-stone-50"
                            >
                              {tab.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
