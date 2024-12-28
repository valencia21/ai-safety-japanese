import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { ReadingOverview } from "@/types";
import { fetchReadings } from "@/utils/reading-utils";

export const ReadingList: React.FC = () => {
  const [readings, setReadings] = useState<ReadingOverview[]>([]);
  const [completedReadings, setCompletedReadings] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('completedReadings');
    if (saved) {
      setCompletedReadings(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedReadings', JSON.stringify([...completedReadings]));
  }, [completedReadings]);

  useEffect(() => {
    const loadReadings = async () => {
      const data = await fetchReadings();
      // Filter out any readings with null titles before setting state
      const validReadings = data.filter(reading => reading.title !== null) as ReadingOverview[];
      setReadings(validReadings);
    };
    loadReadings();
  }, []);

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

  return (
    <div className="w-full bg-white">
      <div className="px-4 py-2">
        <div className="ml-2 flex gap-x-4 items-center justify-left">
          <span className="text-sm text-stone-600">読了済み</span>
          <span className="text-sm font-medium text-stone-900">
            {completedReadings.size} / {readings.length}
          </span>
        </div>
      </div>
      
      <div className="border-t border-l border-r border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {readings.map((reading) => (
            <Link
              key={reading.content_id}
              to={`/${reading.content_id}`}
              className="group border-b border-r border-stone-200 last:border-b-0 md:last:border-b md:nth-last-2:border-b-0 xl:nth-last-3:border-b-0 md:even:border-r-0 xl:even:border-r xl:nth-of-type(3n):border-r-0"
            >
              <div className="p-4 flex items-start justify-between transition-colors duration-200 ease-in-out group-hover:bg-stone-900">
                <div className="flex-1">
                  {reading.original_title && (
                    <span className="text-xs text-stone-500 mb-1 block line-clamp-1 transition-colors duration-200 ease-in-out group-hover:text-white">
                      {reading.original_title}
                    </span>
                  )}
                  <span className="text-sm transition-colors duration-200 ease-in-out group-hover:text-white">
                    {reading.title}
                  </span>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    toggleReadingComplete(reading.content_id);
                  }}
                  className={`h-4 w-4 rounded-sm flex items-center justify-center transition-colors cursor-pointer ml-4
                    ${completedReadings.has(reading.content_id) ? 'bg-stone-700 border-stone-700' : 'bg-stone-200'}
                    hover:border-stone-400
                  `}
                >
                  {completedReadings.has(reading.content_id) && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}; 