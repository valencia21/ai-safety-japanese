import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapMenu } from "./tiptap-menu";
import { saveContent } from "./tiptap-utils";

interface TiptapEditorProps {
  content: any;
  contentId?: string;
  editable?: () => boolean;
}

const extensions = [StarterKit];

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  contentId,
  editable = () => false,
}) => {
  const key = editable() ? "editable" : "not-editable";

  return (
    // @ts-ignore
    <EditorProvider
      key={key}
      extensions={extensions}
      editorProps={{
        editable,
        attributes: {
          class:
            "prose dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none",
        },
      }}
      content={content || ""}
      slotBefore={editable() ? <TiptapMenu /> : null}
      onUpdate={({ editor }) => {
        if (contentId) {
          saveContent(contentId, editor.getJSON());
        }
      }}
    />
  );
};
