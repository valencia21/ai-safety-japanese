import React, { useState, useCallback } from "react";
import { mergeAttributes, Node } from "@tiptap/core";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapMenu } from "./tiptap-menu";
import { saveContent } from "./tiptap-utils";
import {
  getHierarchicalIndexes,
  TableOfContents,
} from "@tiptap-pro/extension-table-of-contents";
import { ToC } from "./toc";
import { SidenoteEditor } from "../sidenote-editor/sidenote-editor";

interface TiptapEditorProps {
  content: any;
  contentId?: string;
  editable?: () => boolean;
  onSidenotePositionsChange: (
    positions: Array<{ id: number; pos: number; yCoordinate: number }>
  ) => void;
}

export interface SidenoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customNode: {
      insertSidenote: () => ReturnType;
    };
  }
}

const SidenoteNode = Node.create<SidenoteOptions>({
  name: "sidenote",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [{ tag: "sup.sidenote" }];
  },

  renderHTML({ node }) {
    return [
      "sup",
      mergeAttributes(this.options.HTMLAttributes, { class: "sidenote" }),
      `${node.attrs.id}`,
    ];
  },

  addCommands() {
    return {
      insertSidenote:
        () =>
        ({ state, dispatch, tr }) => {
          const { doc, selection } = state;
          const { $from } = selection;

          let sidenoteIndex = 0;
          let sidenotesBefore = 0;

          doc.nodesBetween(0, doc.content.size, (node, pos) => {
            if (node.type.name === this.name) {
              sidenoteIndex++;
              if (pos < $from.pos) {
                sidenotesBefore++;
              }
            }
          });

          const newId = sidenotesBefore + 1;

          // Insert the new sidenote
          tr = tr.insert($from.pos, this.type.create({ id: newId }));

          // Update all sidenote numbers
          let currentId = 0;
          tr.doc.nodesBetween(0, tr.doc.content.size, (node, pos) => {
            if (node.type.name === this.name) {
              currentId++;
              if (node.attrs.id !== currentId) {
                tr = tr.setNodeMarkup(pos, null, {
                  ...node.attrs,
                  id: currentId,
                });
              }
            }
          });

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        },
    };
  },
});

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  contentId,
  editable = () => false,
  onSidenotePositionsChange,
}) => {
  const key = editable() ? "editable" : "not-editable";
  const [currentSidenoteId, setCurrentSidenoteId] = useState<number | null>(
    null
  );
  const [isSidenoteEditorOpen, setIsSidenoteEditorOpen] = useState(false);
  const [tocItems, setTocItems] = useState([]);
  const [editor, setEditor] = useState(null);

  const extensions = [
    StarterKit,
    SidenoteNode,
    TableOfContents.configure({
      levels: ["h1", "h2", "h3"],
      onUpdate: (items) => {
        setTocItems(items);
      },
    }),
  ];

  const getSidenoteYCoordinatesWithPos = (editor) => {
    const sidenotes: Array<{ id: number; pos: number; yCoordinate: number }> =
      [];
    const { doc } = editor.state;

    doc.descendants((node, pos) => {
      if (node.type.name === "sidenote") {
        const coords = editor.view.coordsAtPos(pos);
        sidenotes.push({
          id: node.attrs.id,
          pos: pos,
          yCoordinate: coords.top,
        });
      }
    });

    return sidenotes;
  };

  const handleInsertSidenote = (editor) => {
    editor.chain().focus().insertSidenote().run();
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col w-1/4 table-of-contents ml-10">
          <ToC items={tocItems} editor={editor} />
        </div>
        <div className="flex flex-col w-3/4">
          <EditorProvider
            key={key}
            extensions={extensions}
            editorProps={{
              editable,
              attributes: {
                class:
                  "prose dark:prose-invert prose-sm sm:prose-sm lg:prose-sm xl:prose-base focus:outline-none max-w-4xl",
              },
              handleClickOn: (view, pos, node) => {
                if (node.type.name === "sidenote") {
                  setCurrentSidenoteId(node.attrs.id);
                  setIsSidenoteEditorOpen(true);
                }
              },
            }}
            content={content || ""}
            slotBefore={
              editable() ? (
                <TiptapMenu
                  onInsertSidenote={(editor) => handleInsertSidenote(editor)}
                />
              ) : null
            }
            onCreate={({ editor }) => {
              setEditor(editor);
              setTimeout(() => {
                const newPositions = getSidenoteYCoordinatesWithPos(editor);
                onSidenotePositionsChange(newPositions);
              }, 1000);
            }}
            onUpdate={({ editor }) => {
              if (contentId) {
                saveContent(contentId, editor.getJSON());
              }
            }}
          />
        </div>
        {isSidenoteEditorOpen && (
          <SidenoteEditor
            isOpen={isSidenoteEditorOpen}
            onClose={() => setIsSidenoteEditorOpen(false)}
            contentId={contentId}
            sidenoteId={currentSidenoteId}
          />
        )}
      </div>
    </>
  );
};
