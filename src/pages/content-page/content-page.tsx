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
    <div className="container flex flex-col items-center">
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
      <div className="bg-red-100 w-full pt-12 pb-10 mb-16">
        <div className="flex flex-col ml-[24%] justify-end">
          <div className="mb-6">
            <a
              href={reading.link_to_original}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 hover:text-red-500"
            >
              {reading.original_title}
            </a>
          </div>
          <h1 className="max-w-3xl justify-left text-4xl font-bold mb-2 w-full text-black">
            {reading.title}
          </h1>
          <div className="max-w-3xl flex flex-row justify-left w-full">
            <div className="flex flex-row gap-x-4 items-center gap-y-2 text-gray-700">
              <div className="text-base max-w-1/2 md:w-auto">
                <p className="">{reading.author}</p>
              </div>
              <div className="text-sm">
                <p className="">{reading.time_to_read}</p>
              </div>
              <div className="flex flex-row gap-x-4">
                <div className="flex flex-row items-center hidden">
                  {isEditable ? (
                    <LockKeyOpen size="18px" onClick={handleLockClick} />
                  ) : (
                    <LockKey size="18px" onClick={handleLockClick} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs">
            Translated by{" "}
            <span className="font-bold">{reading.translator}</span>
          </div>
          <div className="mt-0.5 mb-2 text-xs">
            Proofread by{" "}
            <span className="font-bold">{reading.proofreader}</span>
          </div>
        </div>
      </div>
      <div className="contentcontainer flex flex-row justify-between items-start w-full mb-24">
        <div ref={editorRef} className="w-4/5">
          <TiptapEditor
            title={reading.title}
            content={reading.content}
            contentId={contentId}
            editable={() => isEditable}
            onSidenotePositionsChange={handleSidenotePositionsChange}
          />
        </div>
        <div className="ml-12 w-1/5">
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
