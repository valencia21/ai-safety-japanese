import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/core";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapMenu } from "./tiptap-menu";
import { saveContent } from "./tiptap-utils";

interface TiptapEditorProps {
  content: any;
  contentId?: string;
  editable?: () => boolean;
}

const FootnoteExtension = Extension.create({
  name: "footnote",

  addNodes() {
    return {
      footnote: {
        node: FootnoteNode,
      },
    };
  },

  addCommands() {
    return {
      insertFootnote:
        () =>
        ({ commands }) => {
          const footnote = {
            type: "footnote",
            attrs: {
              number: 1,
            },
            content: [
              {
                type: "text",
                text: "Footnote content goes here.",
              },
            ],
          };

          return commands.insertContent(footnote);
        },
    };
  },
});

const FootnoteNode = Node.create({
  name: "footnote",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      number: {
        default: 1,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "sup",
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "sup",
      {
        class: "footnote",
      },
      node.attrs.number,
    ];
  },
});

const extensions = [StarterKit, FootnoteExtension];

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
            "prose dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none max-w-4xl",
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
