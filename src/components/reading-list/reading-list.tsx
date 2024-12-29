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
    <div className="w-full">
      <div className="relative border-t border-stone-900 lg:h-[calc(100vh-102px)] lg:flex lg:flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x divide-stone-900 lg:h-full">
          <div className="relative lg:row-span-full p-8 border-b border-stone-900 lg:border-b-0">
            <h2 className="text-2xl font-semibold text-stone-900 mb-4">Animal Ethics</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              動物倫理の入門用のテキストの翻訳記事を公開します。
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              本教材は海外団体「アニマルエシックス（Animal Ethics）」が作成したものです（同団体に関する詳細は<span className="inline-flex"><a href="https://www.animal-ethics.org/" target="_blank" rel="noopener noreferrer" className="text-stone-900 underline">公式サイト</a></span>を参照ください）。
            </p>
            <p className="text-stone-600 leading-relaxed">
              オンラインでアクセスでき、日本語で読める動物倫理の教材が少ないことが、本邦における動物問題に対する理解・意識の低さの一因ではないかと考え、EAジャパンと<span className="inline-flex"><a href="https://animotethics.com/about-jp" target="_blank" rel="noopener noreferrer" className="text-stone-900 underline">AS ── 動物と倫理と哲学のメディア</a></span>の共同プロジェクトとして、同教材を翻訳しました。アニマルエシックスの承認を経て、ここに公開いたします。
            </p>
            <div className="mr-4 flex gap-x-4 items-center justify-start mt-4">
          <span className="text-sm text-stone-600">読了済み</span>
          <span className="text-sm font-medium text-stone-600">
            {completedReadings.size} / {readings.length}
          </span>
        </div>
          </div>

          <div className="lg:col-span-2 lg:overflow-y-auto">
            <div className="relative grid grid-cols-1 sm:grid-cols-2">
              {readings.map((reading) => (
                <Link
                  key={reading.content_id}
                  to={`/${reading.content_id}`}
                  className="group border-b border-stone-900 last:border-b-0 sm:last:border-b sm:nth-last-2:border-b-0 sm:odd:border-r sm:last:border-r-0"
                >
                  <div className="p-4 flex items-start justify-between transition-colors duration-200 ease-in-out group-hover:bg-stone-900">
                    <div className="flex-1">
                      {reading.original_title && (
                        <span className="text-xs text-stone-700 mb-1 block line-clamp-1 transition-colors duration-200 ease-in-out group-hover:text-white">
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
                        ${completedReadings.has(reading.content_id) ? 'bg-stone-700 border-stone-700' : 'bg-stone-700'}
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
      </div>
    </div>
  );
}; 