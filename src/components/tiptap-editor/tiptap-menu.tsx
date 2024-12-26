// src/components/MenuBar.tsx
import { useCurrentEditor } from "@tiptap/react";
import { Link, YoutubeLogo, Function, Code as CodeIcon, Table, SquaresFour, Rows, Columns, TrashSimple, MinusSquare } from "@phosphor-icons/react"
import { useCallback, useState } from "react";
import { LinkMatcherPopup } from './link-matcher-popup';
import "../../index.css";

interface TiptapMenuProps {}

const HIGHLIGHT_COLORS = [
  { name: 'yellow', color: '#fef08a', dataColor: '#fef08a' },
  { name: 'green', color: '#bbf7d0', dataColor: '#bbf7d0' },
  { name: 'blue', color: '#bfdbfe', dataColor: '#bfdbfe' },
  { name: 'pink', color: '#fbcfe8', dataColor: '#fbcfe8' },
  { name: 'purple', color: '#e9d5ff', dataColor: '#e9d5ff' },
  { name: 'grey', color: '#e5e7eb', dataColor: '#e5e7eb' },
];

const formatSrtText = (editor: any) => {
  const { from, to } = editor.state.selection;
  
  // Get all paragraphs in the selection
  const paragraphs: any[] = [];
  editor.state.doc.nodesBetween(from, to, (node: any) => {
    if (node.type.name === 'paragraph') {
      paragraphs.push(node);
    }
  });

  // Group paragraphs into blocks of timing + caption
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const text = paragraphs[i].textContent.trim();
    
    // Skip empty paragraphs
    if (!text) continue;
    
    // Check if it's a timing line
    if (text.match(/\d{1,2}:\d{2}:\d{2}\.\d{3},\d{1,2}:\d{2}:\d{2}\.\d{3}/)) {
      // If we have a previous block, save it
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
        currentBlock = [];
      }
      // Convert timing format from 0:00:00.000,0:00:00.000 to 00:00:00 --> 00:00:00
      const [start, end] = text.split(',');
      const formattedStart = start.split('.')[0].padStart(8, '0');
      const formattedEnd = end.split('.')[0].padStart(8, '0');
      currentBlock.push(`${formattedStart} --> ${formattedEnd}`);
    } else {
      // It's caption text
      currentBlock.push(text);
    }
  }
  
  // Add the last block if exists
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  // Join all blocks with double newlines
  const formattedText = blocks.join('\n\n');

  // Replace the selection with formatted text
  editor
    .chain()
    .focus()
    .deleteSelection()
    .insertContent(formattedText)
    .run();
};

export const TiptapMenu: React.FC<TiptapMenuProps> = ({}) => {
  const { editor } = useCurrentEditor();
  const [showHighlightColors, setShowHighlightColors] = useState(false);
  const [showLinkMatcher, setShowLinkMatcher] = useState(false);
  const [showOrderedListOptions, setShowOrderedListOptions] = useState(false);
  const [showTableOptions, setShowTableOptions] = useState(false);

  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL')
    
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 720,
        height: 480,
      })
    }
  }

  const continueOrderedList = () => {
    // Get the number from the previous ordered list (if any)
    const { state } = editor;
    const { selection } = state;
    let startNumber = 1;

    // Search backwards from current position
    state.doc.nodesBetween(0, selection.from, (node) => {
      if (node.type.name === 'orderedList') {
        startNumber = node.attrs.start + node.childCount;
      }
    });

    // Start new ordered list with the next number
    editor.chain()
      .focus()
      .toggleOrderedList()
      .updateAttributes('orderedList', {
        start: startNumber
      })
      .run();
  };

  const setCustomOrderedListNumber = () => {
    const number = window.prompt('Enter starting number:');
    if (number !== null) {
      const startNumber = parseInt(number);
      if (!isNaN(startNumber)) {
        editor.chain()
          .focus()
          .toggleOrderedList()
          .updateAttributes('orderedList', {
            start: startNumber
          })
          .run();
      }
    }
  };

  const insertMathFormula = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText) {
      // If there's selected text, wrap it in LaTeX delimiters
      editor.chain()
        .focus()
        .deleteSelection()
        .insertContent(`$${selectedText}$`)
        .run();
    } else {
      // If no text is selected, prompt for formula
      const formula = window.prompt('Enter LaTeX formula:', '');
      if (formula) {
        editor.commands.insertContent(`$${formula}$`);
      }
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold") ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic") ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          italic
        </button>
        <div className="relative inline-block">
          <button
            onClick={() => setShowHighlightColors(!showHighlightColors)}
            className={`${
              editor.isActive('highlight') ? "is-active" : ""
            } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center`}
          >
            highlight
            <svg className="w-2 h-2 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div 
            className={`${showHighlightColors ? '' : 'hidden'} absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg p-1`}
          >
            {HIGHLIGHT_COLORS.map(({ name, color, dataColor }) => (
              <button
                key={name}
                onClick={() => editor.chain().focus().toggleHighlight({ color: dataColor }).run()}
                className={`${
                  editor.isActive('highlight', { color: dataColor }) ? "is-active" : ""
                } block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded`}
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-2 rounded" 
                    style={{ backgroundColor: color }}
                  />
                  {name}
                </div>
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
            <button
              onClick={() => editor.chain().focus().unsetHighlight().run()}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              clear highlight
            </button>
          </div>
        </div>
        {/* Heading buttons */}
        {["h1", "h2", "h3"].map((heading) => (
          <button
            key={heading}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: parseInt(heading[1]) as any })
                .run()
            }
            disabled={
              !editor
                .can()
                .chain()
                .focus()
                .toggleHeading({ level: parseInt(heading[1]) as any })
                .run()
            }
            className={`${
              editor.isActive("heading", { level: parseInt(heading[1]) as any })
                ? "is-active"
                : ""
            } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
          >
            {heading}
          </button>
        ))}
        {/* Paragraph button */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={!editor.can().chain().focus().setParagraph().run()}
          className={`${
            editor.isActive("paragraph") ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          paragraph
        </button>
        {/* Text alignment buttons */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${
            editor.isActive({ textAlign: "left" }) ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${
            editor.isActive({ textAlign: "right" }) ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200`}
        >
          right
        </button>
        {/* Image button */}
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          image
        </button>
        <button
          onClick={addYoutubeVideo}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1"
        >
          <YoutubeLogo size={18} />
          YouTube
        </button>
        {/* Bullet list button */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          bullet list
        </button>
        {/* Ordered list button */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowOrderedListOptions(!showOrderedListOptions)}
            className={`${
              editor.isActive('orderedList') ? "is-active" : ""
            } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center`}
          >
            ordered list
            <svg className="w-2 h-2 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div 
            className={`${showOrderedListOptions ? '' : 'hidden'} absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg p-1`}
          >
            <button
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setShowOrderedListOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              New list
            </button>
            <button
              onClick={() => {
                continueOrderedList();
                setShowOrderedListOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Continue previous
            </button>
            <button
              onClick={() => {
                setCustomOrderedListNumber();
                setShowOrderedListOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              Set custom number
            </button>
          </div>
        </div>
        {/* Link button */}
        <button
          onClick={setLink}
          className={`bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 ${
            editor.isActive('link') ? 'is-active' : ''
          }`}
        >
          <Link size={18} />
        </button>
        {/* Caption button */}
        <button
          onClick={() => editor.chain().focus().toggleImageCaption().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          caption
        </button>
        <button
          onClick={() => editor.chain().focus().setDetails().run()}
          disabled={!editor.can().setDetails()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Set details
        </button>
        <button
          onClick={() => editor.chain().focus().unsetDetails().run()}
          disabled={!editor.can().unsetDetails()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Unset details
        </button>
        {/* Sidenote button */}
        <button
          onClick={() => editor.chain().focus().insertSidenote().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Insert Sidenote
        </button>
        <button
          onClick={() => formatSrtText(editor)}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Format SRT
        </button>
        <button
          onClick={() => setShowLinkMatcher(true)}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Match Links
        </button>
        <button
          onClick={insertMathFormula}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1"
        >
          <Function size={18} />
          Math
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`${
            editor.isActive('code') ? "is-active" : ""
          } bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1`}
        >
          <CodeIcon size={18} />
          code
        </button>
        <div className="relative inline-block">
          <button
            onClick={() => setShowTableOptions(!showTableOptions)}
            className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 inline-flex items-center gap-1"
          >
            <Table size={18} />
            Table
            <svg className="w-2 h-2 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div 
            className={`${showTableOptions ? '' : 'hidden'} absolute z-50 mt-1 bg-white dark:bg-gray-800 rounded shadow-lg p-1`}
          >
            <button
              onClick={() => {
                insertTable();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <SquaresFour size={18} />
              Insert Table
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addColumnBefore().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <Columns size={18} />
              Add Column Before
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addColumnAfter().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <Columns size={18} />
              Add Column After
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addRowBefore().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <Rows size={18} />
              Add Row Before
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addRowAfter().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <Rows size={18} />
              Add Row After
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteColumn().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <MinusSquare size={18} />
              Delete Column
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteRow().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1"
            >
              <MinusSquare size={18} />
              Delete Row
            </button>
            <button
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                setShowTableOptions(false);
              }}
              className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded inline-flex items-center gap-1 text-red-500"
            >
              <TrashSimple size={18} />
              Delete Table
            </button>
          </div>
        </div>
      </div>
      
      <LinkMatcherPopup
        editor={editor}
        isOpen={showLinkMatcher}
        onClose={() => setShowLinkMatcher(false)}
      />
    </div>
  );
};
