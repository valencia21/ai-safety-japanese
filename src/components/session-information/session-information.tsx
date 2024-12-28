import React, { useState, useEffect } from "react";
import {
  fetchReadings,
  groupReadingsBySession,
  fetchSessions,
} from "@/utils/reading-utils";
import { Link } from "react-router-dom";
import { ReadingOverview } from "@/types";
import { Check } from "lucide-react";

// Add new interface for progress tracking
interface SessionProgress {
  required: number;
  recommended: number;
  totalRequired: number;
  totalRecommended: number;
}

// Add this near the top of the file with other interfaces
interface Reading {
  content_id: string;
  title: string;
  original_title?: string;
  format?: string;
  order?: number;
}

const ReadingItem: React.FC<{
  reading: ReadingOverview;
  isCompleted: boolean;
  onToggleComplete: () => void;
}> = ({ reading, isCompleted, onToggleComplete }) => {
  return (
    <div className="flex items-center gap-4">
      <Link
        to={`/${reading.content_id}`}
        className="block flex-1 group cursor-pointer border-b border-stone-200"
      >
        <div className="flex my-1 items-center w-full rounded transition-colors duration-200 ease-in-out group-hover:bg-stone-900 p-2">
          <div className="flex-1">
            {reading.original_title && (
              <span className="text-xs text-stone-500 mb-0.5 block transition-colors duration-200 ease-in-out group-hover:text-white">
                {reading.original_title}
              </span>
            )}
            <span className="text-sm transition-colors duration-200 ease-in-out group-hover:text-white">
              {reading.title}
            </span>
          </div>
          <span className="text-xs text-stone-500 transition-colors duration-200 ease-in-out group-hover:text-white mx-2">
            {reading.format}
          </span>
        </div>
      </Link>
      <div
        onClick={onToggleComplete}
        className={`h-4 w-4 rounded-sm flex items-center justify-center transition-colors cursor-pointer
          ${isCompleted ? 'bg-stone-700 border-stone-700' : 'bg-stone-200'}
          hover:border-stone-400
        `}
      >
        {isCompleted && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
    </div>
  );
};

const SessionNavItem: React.FC<{
  session: any;
  isActive: boolean;
  progress: SessionProgress;
  onClick: () => void;
}> = ({ session, isActive, progress, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-y-1 w-full text-left rounded py-2 px-4 hover:bg-stone-100 transition-colors ${
        isActive ? 'bg-stone-100' : ''
      }`}
    >
      <h3 className="text-xs text-stone-400">
        {session.session_counter_jp}
      </h3>
      <h2 className="text-base font-medium text-stone-900 mb-2">
        {session.title}
      </h2>
      <div className="w-full text-xs font-light flex flex-col gap-y-1">
        <div className="flex flex-row items-center justify-between text-stone-500">
          <span className="">メイン資料</span>
          <span>{progress.required}/{progress.totalRequired}</span>
        </div>
        <div className="flex items-center text-stone-500">
          <span className="flex-1">補足資料</span>
          <span>{progress.recommended}/{progress.totalRecommended}</span>
        </div>
      </div>
    </button>
  );
};

export const SessionInformation: React.FC = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [completedReadings, setCompletedReadings] = useState<Set<string>>(new Set());
  const [activeSession, setActiveSession] = useState<number | null>(null);

  // Load completed readings from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('completedReadings');
    if (saved) {
      setCompletedReadings(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save completed readings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('completedReadings', JSON.stringify([...completedReadings]));
  }, [completedReadings]);

  const toggleReadingComplete = (readingId: string) => {
    setCompletedReadings(prev => {
      const next = new Set(prev);
      if (next.has(readingId)) {
        next.delete(readingId);
      } else {
        next.add(readingId);
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readingsData, sessionsData] = await Promise.all([
          fetchReadings(),
          fetchSessions(),
        ]);
        setReadings(readingsData);
        setSessions(sessionsData);
        // Set the first session as active by default
        if (sessionsData.length > 0) {
          setActiveSession(sessionsData[0].id);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedReadings = groupReadingsBySession(readings);

  const getDisplayReadings = (readings: ReadingOverview[]) => {
    return readings
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .slice(0, 4);
  };

  const calculateProgress = (sessionNumber: number): SessionProgress => {
    const required = groupedReadings[sessionNumber]?.requiredReadings || [];
    const recommended = groupedReadings[sessionNumber]?.recommendedReadings || [];
    
    return {
      required: required.filter((r: Reading) => completedReadings.has(r.content_id)).length,
      recommended: recommended.filter((r: Reading) => completedReadings.has(r.content_id)).length,
      totalRequired: required.length,
      totalRecommended: recommended.length,
    };
  };

  const activeSessionData = sessions.find(s => s.id === activeSession);

  return (
    <div className="fixed inset-x-0 bottom-0 top-[102px]">
      <div className="h-full flex">
        {/* Left sidebar - fixed position */}
        <div className="hidden md:block w-96 border-r border-stone-200">
          <div className="px-4 py-6">
            <div className="divide-y divide-stone-200">
              {sessions.map((session) => {
                const progress = calculateProgress(session.session_number);
                return (
                  <SessionNavItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSession}
                    progress={progress}
                    onClick={() => setActiveSession(session.id)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Main content area - scrollable */}
        <div className="flex-1 overflow-y-auto mt-1 mb-8">
          <div 
            className={`w-full ${window.matchMedia('(min-width: 768px)').matches ? 'ml-8' : ''}`}
            style={{ 
              maxWidth: window.matchMedia('(min-width: 768px)').matches 
                ? 'min(calc(72rem - 384px + ((100vw - 72rem) / 2)), calc(100vw - 384px - 64px))'
                : 'none'
            }}
          >
            {activeSessionData && (
              <div className="px-4 sm:px-6 py-6">
                <div className="mb-8">
                  <h3 className="text-base text-stone-400 mb-4">
                    {activeSessionData.session_counter_jp}
                  </h3>
                  <h2 className="text-2xl font-semibold text-stone-900 mt-1">
                    {activeSessionData.title}
                  </h2>
                  <p className="text-stone-600 mt-2 text-base whitespace-pre-line">
                    {activeSessionData.description}
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Required Readings Section */}
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-4">
                    メイン資料
                    </h3>
                    <div className="overflow-hidden">
                      <div className="">
                        {getDisplayReadings(
                          groupedReadings[activeSessionData.session_number]?.requiredReadings || []
                        ).map((reading: ReadingOverview, index: number) => (
                          <ReadingItem 
                            key={index} 
                            reading={reading} 
                            isCompleted={completedReadings.has(reading.content_id)}
                            onToggleComplete={() => toggleReadingComplete(reading.content_id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Readings Section */}
                  <div>
                    <h3 className="text-sm font-medium text-stone-600 mb-4">
                      補足資料
                    </h3>
                    <div className="overflow-hidden">
                      <div className="">
                        {getDisplayReadings(
                          groupedReadings[activeSessionData.session_number]?.recommendedReadings || []
                        ).map((reading: ReadingOverview, index: number) => (
                          <ReadingItem 
                            key={index} 
                            reading={reading} 
                            isCompleted={completedReadings.has(reading.content_id)}
                            onToggleComplete={() => toggleReadingComplete(reading.content_id)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
