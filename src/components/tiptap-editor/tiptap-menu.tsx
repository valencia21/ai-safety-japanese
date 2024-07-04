// src/components/MenuBar.tsx
import { useCurrentEditor } from "@tiptap/react";

interface TiptapMenuProps {}

export const TiptapMenu: React.FC<TiptapMenuProps> = ({}) => {
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
          onClick={() => editor.chain().focus().setImage({ src: "" }).run()}
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
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              // Check if URL is not null or empty
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url, target: "_blank" })
                .run();
            }
          }}
          className="bg-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200"
        >
          link
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
    </>
  );
};
