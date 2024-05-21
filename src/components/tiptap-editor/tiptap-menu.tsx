// src/components/MenuBar.tsx
import { useCurrentEditor } from "@tiptap/react";

export const TiptapMenu = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex flex-row gap-x-2">
        {/* Add your menu buttons here */}
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
        {/* Add more buttons as needed */}
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
        {/* Footnote button */}
        <button
          onClick={() => editor.chain().focus().insertFootnote().run()}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          Insert Footnote
        </button>
        {/* Image button */}
      </div>
    </>
  );
};
