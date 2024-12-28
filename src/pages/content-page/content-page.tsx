// src/ContentPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { TiptapEditor } from "../../components/tiptap-editor/tiptap-editor";
import { supabase } from "../../supabase-client";
import { LockKey, LockKeyOpen, Link } from "@phosphor-icons/react";
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
  const [showBottomSidenote, setShowBottomSidenote] = useState(false);
  const [currentSidenoteId, setCurrentSidenoteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        console.log("Sidenotes data:", data.sidenotes);
        setReading(data as Reading);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchReading();
  }, [contentId]);

  useEffect(() => {
    const handleShowSidenote = (event: CustomEvent<{ id: number }>) => {
      console.log("Received sidenote event", event.detail);
      setCurrentSidenoteId(event.detail.id);
      setShowBottomSidenote(true);
    };

    window.addEventListener('showSidenote', handleShowSidenote as EventListener);

    return () => {
      window.removeEventListener('showSidenote', handleShowSidenote as EventListener);
    };
  }, []);

  const handleLockClick = () => {
    const enteredKey = window.prompt("Enter the secret key to edit");
    if (enteredKey === secretKey) {
      setIsEditable(true);
    } else {
      alert("Incorrect key");
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Show loading overlay when loading OR reading is null */}
      {(isLoading || !reading) && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <Loading type="line" className="text-black" size="lg" />
        </div>
      )}
      
      {/* Only render content if reading exists */}
      {reading && (
        <div className={`w-full flex flex-col items-center ${isLoading ? 'opacity-0' : ''}`}>
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
          <div className="bg-stone-200 w-full pt-12 pb-8">
            <div className="container mx-auto px-6">
              <div className="flex">
                <div className="w-full flex">
                  <div className="w-full">
                    <div className="mb-6">
                      <div className="flex flex-row gap-x-2 items-center text-stone-900 text-lg">
                        <a 
                          href={reading.link_to_original}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center hover:text-stone-600 transition-colors"
                        >
                          {reading.original_title}
                          <Link size="18px" className="ml-2" />
                        </a>
                      </div>
                    </div>
                    <h1 className="max-w-6xl justify-left text-4xl font-bold mb-2 w-full text-stone-900">
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

          {/* Author section - update the width classes */}
          <div className="w-full bg-stone-900 mb-16 text-white">
            <div className="container mx-auto flex my-0 py-4">
              <div className="w-full flex">
                <div className="w-full px-6">
                  <div className="flex gap-x-8">
                    <div className="mr-12">
                      <div className="text-xxs uppercase mb-1">Author</div>
                      <div className="text-base">{reading.author}</div>
                    </div>
                    {reading.translator && (
                      <div className="">
                        <div className="text-xxs uppercase mb-1">Translator</div>
                        <div className="text-base">{reading.translator}</div>
                      </div>
                    )}
                    {reading.proofreader && (
                      <div className="">
                        <div className="text-xxs uppercase mb-1">Proofreader</div>
                        <div className="text-base">{reading.proofreader}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container flex flex-row justify-between items-start w-full mb-24">
            <div className="w-full lg:w-4/5 lg:mx-0">
              {/* Mobile view */}
              <div className="lg:hidden">
                <div className="px-4 sm:px-6 mx-auto -ml-4" style={{ maxWidth: "100ch" }}>
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

              {/* Desktop view */}
              <div className="hidden lg:block">
                <div className="relative px-2">
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
            </div>

            {/* Desktop sidenotes */}
            <div className="ml-12 hidden lg:flex lg:w-1/5">
              {sidenotePositions && (
                <Sidenotes
                  editorTopPosition={editorTopPosition}
                  sidenotes={reading.sidenotes}
                  sidenotePositions={sidenotePositions}
                  showBottomSidenote={showBottomSidenote}
                  currentSidenoteId={currentSidenoteId}
                  onCloseBottomSidenote={() => setShowBottomSidenote(false)}
                />
              )}
            </div>
          </div>

          {/* Mobile bottom sidenote */}
          <div className="lg:hidden">
            <Sidenotes
              editorTopPosition={editorTopPosition}
              sidenotes={reading.sidenotes}
              sidenotePositions={sidenotePositions}
              showBottomSidenote={showBottomSidenote}
              currentSidenoteId={currentSidenoteId}
              onCloseBottomSidenote={() => setShowBottomSidenote(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
