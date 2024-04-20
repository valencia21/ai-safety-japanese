// src/ContentPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TiptapEditor } from "../../components/tiptap-editor/tiptap-editor";
import { supabase } from "../../supabase-client";
import { LinkToOriginalButton } from "../../components/button/link-to-original-button";
import { LockKey, LockKeyOpen } from "@phosphor-icons/react";
import { Loading } from "@lemonsqueezy/wedges";

interface Reading {
  id: number;
  title: string;
  time_to_read: string;
  author: string;
  link_to_original: string;
  image: string;
  content: string;
}

const ContentPage: React.FC = ({}) => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const { contentId } = useParams<{ contentId?: string }>();
  const secretKey = import.meta.env.VITE_EDITING_KEY;

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
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      {reading.image && (
        <img
          src={reading.image}
          alt={reading.title}
          className="max-w-3xl mb-6 rounded-lg max-h-[400px]"
        />
      )}
      <h1 className="max-w-3xl justify-left text-3xl font-bold mb-2 w-full">
        {reading.title}
      </h1>
      <div className="max-w-3xl flex flex-row justify-left w-full">
        <div className="flex flex-col sm:flex-row gap-x-4 mb-12 items-left sm:items-center gap-y-2">
          <div className="flex flex-row gap-x-4">
            <div className="text-red-700 text-sm">
              <p className="">{reading.author}</p>
            </div>
            <div className="text-red-700 text-sm">
              <p className="">想定時間 {reading.time_to_read}</p>
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="">
              <LinkToOriginalButton href={reading.link_to_original} />
            </div>
            <div className="text-gray-900 flex flex-row items-center">
              {isEditable ? (
                <LockKeyOpen size="18px" onClick={handleLockClick} />
              ) : (
                <LockKey size="18px" onClick={handleLockClick} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl w-full">
        <TiptapEditor
          content={reading.content}
          contentId={contentId}
          editable={() => isEditable}
        />
      </div>
    </div>
  );
};

export default ContentPage;
