import React, { useState, useEffect } from "react";
import {
  fetchReadings,
  groupReadingsBySession,
  fetchSessions,
} from "@/utils/reading-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FlashcardButton } from "../button/flashcard-button";
import { Link } from "react-router-dom";
import { ReadingOverview } from "@/types";

export const SessionInformation: React.FC = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [readingsData, sessionsData] = await Promise.all([
          fetchReadings(),
          fetchSessions(),
        ]);
        setReadings(readingsData);
        setSessions(sessionsData);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedReadings = groupReadingsBySession(readings);

  return (
    <div className="flex flex-col max-w-full lg:max-w-6xl mt-6 lg:mt-12">
      {sessions.map((session) => (
        <div key={session.id} className="flex flex-col lg:flex-row mb-20">
          <div className="lg:w-2/5 p-4">
            <div className="flex flex-col gap-y-2">
              <h2 className="font-bold text-gray-500">
                {session.session_counter_jp}
              </h2>
              <p className="text-lg text-blue-800">{session.title}</p>
              <p className="text-gray-800">{session.description}</p>
            </div>
          </div>
          <div className="lg:w-px bg-gray-300"></div>
          <div className="flex flex-col gap-y-2 items-start justify-start border-t border-gray-300 lg:border-none mt-6 lg:mt-0 lg:w-3/5 lg:pl-10 p-4">
            <div className="text-blue-800 mt-6 lg:mt-0">課題図書</div>
            <Accordion type="single" collapsible className="w-full">
              {groupedReadings[session.session_number]?.requiredReadings.map(
                (reading: ReadingOverview, index: number) => (
                  <AccordionItem key={index} value={`required-${index}`}>
                    <div className="flex items-center justify-between w-full my-2">
                      <Link
                        to={`/${reading.content_id}`}
                        className="text-base flex w-4/5 text-left hover:underline"
                      >
                        {reading.title}
                      </Link>
                      <div className="flex flex-col items-center mr-2 px-2 py-1 text-red-700 text-xs">
                        {reading.format}
                      </div>
                      <AccordionTrigger></AccordionTrigger>
                    </div>
                    <AccordionContent>
                      <p className="text-gray-600">{reading.description}</p>
                      <FlashcardButton />
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
            <div className="mt-6 text-blue-800">補足資料</div>
            <Accordion type="single" collapsible className="w-full">
              {groupedReadings[session.session_number]?.recommendedReadings.map(
                (reading: ReadingOverview, index: number) => (
                  <AccordionItem key={index} value={`recommended-${index}`}>
                    <div className="flex items-center justify-between w-full my-2">
                      <Link
                        to={`/${reading.content_id}`}
                        className="text-base flex w-4/5 text-left hover:underline"
                      >
                        {reading.title}
                      </Link>
                      <div className="flex flex-col items-center mr-2 px-2 py-1 text-red-700 text-xs">
                        {reading.format}
                      </div>
                      <AccordionTrigger></AccordionTrigger>
                    </div>
                    <AccordionContent>
                      <p className="text-gray-600">{reading.description}</p>
                      <FlashcardButton />
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>
        </div>
      ))}
    </div>
  );
};
