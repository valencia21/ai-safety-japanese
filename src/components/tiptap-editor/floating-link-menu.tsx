import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Link } from '@phosphor-icons/react';

interface FloatingLinkMenuProps {
  editor: Editor;
}

export const FloatingLinkMenu: React.FC<FloatingLinkMenuProps> = ({ editor }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenu = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) {
      setIsVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const text = range.toString();

    if (!text || text.length === 0) {
      setIsVisible(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setIsVisible(true);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      updateMenu();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
      className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 px-2 z-50"
    >
      <button
        onClick={addLink}
        className="flex items-center gap-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
      >
        <Link size={14} />
        Add link
      </button>
    </div>
  );
}; 