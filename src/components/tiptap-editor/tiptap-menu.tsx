// src/components/MenuBar.tsx
import { useCurrentEditor } from "@tiptap/react";
import { Link } from "@phosphor-icons/react"
import { useCallback, useState } from "react";

interface TiptapMenuProps {}

const HIGHLIGHT_COLORS = [
  { name: 'yellow', color: '#fef08a' },
  { name: 'green', color: '#bbf7d0' },
  { name: 'blue', color: '#bfdbfe' },
  { name: 'pink', color: '#fbcfe8' },
  { name: 'purple', color: '#e9d5ff' },
  { name: 'grey', color: '#e5e7eb' },
];

export const TiptapMenu: React.FC<TiptapMenuProps> = ({}) => {
  const { editor } = useCurrentEditor();
  const [showHighlightColors, setShowHighlightColors] = useState(false);

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
            {HIGHLIGHT_COLORS.map(({ name, color }) => (
              <button
                key={name}
                onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                className={`${
                  editor.isActive('highlight', { color }) ? "is-active" : ""
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
        {/* Bullet list button */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          bullet list
        </button>
        {/* Ordered list button */}
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          ordered list
        </button>
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
      </div>
    </div>
  );
};
