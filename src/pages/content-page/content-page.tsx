// src/ContentPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { TiptapEditor } from "../../components/tiptap-editor/tiptap-editor";
import { supabase } from "../../supabase-client";
import { LockKey, LockKeyOpen } from "@phosphor-icons/react";
import { Loading } from "@lemonsqueezy/wedges";
import { Sidenotes } from "@/components/sidenotes/sidenotes";

interface Reading {
  id: number;
  title: string;
  original_title: string;
  time_to_read: string;
  author: string;
  link_to_original: string;
  image: string;
  content: string;
  sidenotes: any;
  translator: string;
  proofreader: string;
}

const ContentPage: React.FC = ({}) => {
  const [reading, setReading] = useState<Reading | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const { contentId } = useParams<{ contentId?: string }>();
  const secretKey = import.meta.env.VITE_EDITING_KEY;
  const [editorTopPosition, setEditorTopPosition] = useState<number | null>(
    null
  );
  console.log("editorTopPosition", editorTopPosition);
  const [sidenotePositions, setSidenotePositions] = useState<
    Array<{ id: number; pos: number; yCoordinate: number }>
  >([]);

  const handleSidenotePositionsChange = (
    newPositions: Array<{ id: number; pos: number; yCoordinate: number }>
  ) => {
    setSidenotePositions(newPositions);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current) {
        const rect = editorRef.current.getBoundingClientRect();
        setEditorTopPosition(rect.top);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchReading = async () => {
      if (!contentId) return;
      
      const { data, error } = await supabase
        .from("reading_details")
        .select("*")
        .eq("content_id", contentId)
        .single();

      if (error) {
        console.error("Error fetching reading:", error);
      } else {
        setReading(data as Reading);
      }
    };

    fetchReading();
  }, [contentId]);

  if (!reading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loading type="line" className="text-wg-red" size="lg" />
      </div>
    );
  }

  const handleLockClick = () => {
    const enteredKey = window.prompt("Enter the secret key to edit");
    if (enteredKey === secretKey) {
      setIsEditable(true);
    } else {
      alert("Incorrect key");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/*
      <div className="flex flex-col items-center sm:max-w-3xl w-screen">
        {reading.image && (
          <img
            src={reading.image}
            alt={reading.title}
            className="mb-6 sm:rounded-lg max-h-[400px]"
          />
        )}
      </div>
      */}
      <div className="bg-stone-900 w-full pt-12 pb-8">
        <div className="container mx-auto flex-col">
          <div className="flex">
            {/* This div represents the 4/5 of the full width */}
            <div className="w-full sm:w-4/5 flex">
              {/* This div represents 1/4 of the 4/5 section (empty space) */}
              <div className="hidden sm:flex sm:w-1/4"></div>
              {/* This div contains your content, taking up 3/4 of the 4/5 section */}
              <div className="w-full sm:w-3/4 ml-10 sm:ml-16">
                <div className="mb-6">
                  <a
                    href={reading.link_to_original}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white text-lg"
                  >
                    {reading.original_title}
                  </a>
                </div>
                <h1 className="max-w-3xl justify-left text-4xl font-bold mb-2 w-full text-white">
                  {reading.title}
                </h1>
                <div className="max-w-3xl flex flex-row justify-left w-full">
                  <div className="flex flex-row gap-x-4 items-center gap-y-2 text-white hidden">
                    <div className="text-sm">
                      <p className="">{reading.time_to_read}</p>
                    </div>
                    <div className="flex flex-row gap-x-4">
                      <div className="flex flex-row items-center text-white">
                        {isEditable ? (
                          <LockKeyOpen size="18px" onClick={handleLockClick} />
                        ) : (
                          <LockKey size="18px" onClick={handleLockClick} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New section for author, translator, and proofreader */}
      <div className="w-full bg-stone-500 mb-16 text-white">
        <div className="container mx-auto flex my-0 py-4">
          <div className="w-4/5 flex">
            <div className="hidden sm:flex sm:w-1/4"></div>
            <div className="w-full sm:w-3/4 ml-10 sm:ml-16">
              <div className="flex gap-x-8">
                <div className="w-3/5">
                  <div className="text-xxs uppercase mb-1">Author</div>
                  <div className="text-base">{reading.author}</div>
                </div>
                <div className="w-1/5">
                  <div className="text-xxs uppercase mb-1">Translator</div>
                  <div className="text-sm">{reading.translator}</div>
                </div>
                <div className="w-1/5">
                  <div className="text-xxs uppercase mb-1">Proofreader</div>
                  <div className="text-sm">{reading.proofreader}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-row justify-between items-start w-full mb-24">
        <div className="w-full mx-8 sm:w-4/5">
          <div className="relative">
            <div ref={editorRef} className="w-full">
              <TiptapEditor
                title={reading.title}
                content={reading.content}
                contentId={contentId}
                editable={() => isEditable}
                onSidenotePositionsChange={handleSidenotePositionsChange}
              />
            </div>
          </div>
        </div>
        <div className="ml-12 hidden sm:flex sm:w-1/5">
          {sidenotePositions && (
            <Sidenotes
              editorTopPosition={editorTopPosition}
              sidenotes={reading.sidenotes}
              sidenotePositions={sidenotePositions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
