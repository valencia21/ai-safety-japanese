// src/components/SidenoteEditorPopup.tsx
import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { supabase } from "../../supabase-client";

interface SidenoteEditorProps {
  contentId: string | undefined;
  sidenoteId: number;
  onClose: () => void;
  isOpen: boolean;
}

export const SidenoteEditor = ({ contentId, sidenoteId, onClose, isOpen }: SidenoteEditorProps) => {
  const [sidenoteContent, setSidenoteContent] = useState("");

  useEffect(() => {
    if (contentId && sidenoteId !== null) {
      fetchSidenotes();
    }
  }, [contentId, sidenoteId]);

  const fetchSidenotes = async () => {
    if (!contentId) return;

    const { data: fetchedSidenotes, error } = await supabase
      .from('reading_details')
      .select('sidenotes')
      .eq("content_id", contentId);

    if (error) {
      console.error('Error fetching sidenotes:', error);
      return;
    }

    if (fetchedSidenotes && fetchedSidenotes[0]?.sidenotes) {
      const sidenotes = fetchedSidenotes[0].sidenotes as Record<string, string>;
      setSidenoteContent(sidenotes[sidenoteId.toString()] || "");
    }
  };

  const saveSidenote = async () => {
    if (!contentId) return;

    const { data: existingData, error: fetchError } = await supabase
      .from('reading_details')
      .select('sidenotes')
      .eq("content_id", contentId)
      .single();

    if (fetchError) {
      console.error("Error fetching existing data:", fetchError);
      return;
    }

    const updatedSidenotes: Record<string, string> = {
      ...((existingData?.sidenotes as Record<string, string>) || {}),
      [sidenoteId.toString()]: sidenoteContent,
    };

    try {
      const { error } = await supabase
        .from("reading_details")
        .update({ sidenotes: updatedSidenotes })
        .eq("content_id", contentId);

      if (error) throw error;

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

    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;

    const newContent = 
      sidenoteContent.substring(0, textarea.selectionStart) +
      link +
      sidenoteContent.substring(textarea.selectionEnd);

    setSidenoteContent(newContent);
  };

  if (!contentId || !isOpen) return null;

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
          className="w-full h-40 p-2 border rounded"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveSidenote}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidenoteEditor;
