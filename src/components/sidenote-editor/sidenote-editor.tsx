// src/components/SidenoteEditorPopup.tsx
import React, { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { supabase } from "../../supabase-client";

interface SidenoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: string;
  sidenoteId: number | null;
}

export const SidenoteEditor: React.FC<SidenoteEditorProps> = ({
  isOpen,
  onClose,
  contentId,
  sidenoteId,
}) => {
  const [sidenotes, setSidenotes] = useState<any>({});
  const [sidenoteContent, setSidenoteContent] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  useEffect(() => {
    if (isOpen && contentId && sidenoteId !== null) {
      fetchSidenoteContent();
    }
  }, [isOpen, contentId, sidenoteId]);

  const fetchSidenoteContent = async () => {
    try {
      const { data, error } = await supabase
        .from("reading_details")
        .select("sidenotes")
        .eq("content_id", contentId)
        .single();

      if (error) throw error;

      const fetchedSidenotes = data.sidenotes || {};
      setSidenotes(fetchedSidenotes);
      if (sidenoteId !== null) {
        setSidenoteContent(fetchedSidenotes[sidenoteId] || "");
      }
    } catch (error) {
      console.error("Error fetching sidenote content:", error);
    }
  };

  const handleSaveSidenote = async () => {
    const updatedSidenotes = {
      ...sidenotes,
      [sidenoteId!]: sidenoteContent,
    };

    try {
      const { error } = await supabase
        .from("reading_details")
        .update({ sidenotes: updatedSidenotes })
        .eq("content_id", contentId);

      if (error) throw error;

      setSidenotes(updatedSidenotes);
      console.log("Sidenote saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving sidenote:", error);
    }
  };

  const handleAddLink = () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const selectedText = sidenoteContent.substring(textarea.selectionStart, textarea.selectionEnd);
    
    const url = window.prompt('Enter URL:');
    if (!url) return;

    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-red-700 hover:text-red-500">${selectedText}</a>`;

    const newContent = 
      sidenoteContent.substring(0, textarea.selectionStart) +
      link +
      sidenoteContent.substring(textarea.selectionEnd);

    setSidenoteContent(newContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Sidenote {sidenoteId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="mb-2">
          <button
            onClick={handleAddLink}
            className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 mr-2"
          >
            Add Link
          </button>
        </div>
        <textarea
          value={sidenoteContent}
          onChange={(e) => setSidenoteContent(e.target.value)}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setSelectionStart(target.selectionStart);
            setSelectionEnd(target.selectionEnd);
          }}
          className="w-full h-40 p-2 border rounded"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveSidenote}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
