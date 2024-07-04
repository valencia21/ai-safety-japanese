import React, { useState } from "react";
import { mergeAttributes, Node, Extension } from "@tiptap/core";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapMenu } from "./tiptap-menu";
import { saveContent } from "./tiptap-utils";
import { TableOfContents } from "@tiptap-pro/extension-table-of-contents";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Details from "@tiptap-pro/extension-details";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import { ToC } from "./toc";
import { SidenoteEditor } from "../sidenote-editor/sidenote-editor";

interface TiptapEditorProps {
  title: any;
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
    imageCaption: {
      toggleImageCaption: () => ReturnType;
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

const ImageCaption = Extension.create({
  name: "imageCaption",

  addCommands() {
    return {
      toggleImageCaption:
        () =>
        ({ chain }) => {
          console.log("toggleImageCaption");
          return chain()
            .toggleMark("textStyle", { color: "rgb(107 114 128)" })
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleImageCaption(),
    };
  },
});

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  title,
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
    Color,
    Image,
    ImageResize,
    ImageCaption,
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Details.configure({
      persist: true,
      HTMLAttributes: {
        class: "details",
      },
    }),
    DetailsSummary,
    DetailsContent,
    Placeholder.configure({
      includeChildren: true,
      placeholder: ({ node }) => {
        if (node.type.name === "detailsSummary") {
          return "Summary";
        }

        return ""; // Return an empty string instead of null
      },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        class: "tiptap-link",
      },
    }),
    TableOfContents.configure({
      onUpdate: (items) => {
        // @ts-ignore
        setTocItems(items);
      },
    }),
    FileHandler.configure({
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      onDrop: (currentEditor, files, pos) => {
        files.forEach((file) => {
          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: "image",
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run();
          };
        });
      },
    }),
  ];

  // @ts-ignore
  const getSidenoteYCoordinatesWithPos = (editor) => {
    const sidenotes: Array<{ id: number; pos: number; yCoordinate: number }> =
      [];
    const { doc } = editor.state;

    // @ts-ignore
    doc.descendants((node, pos: number) => {
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

  // @ts-ignore
  const handleInsertSidenote = (editor) => {
    editor.chain().focus().insertSidenote().run();
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col w-1/4 table-of-contents mx-10 sticky top-16 max-h-[50vh] overflow-visible">
          <div className="font-bold pb-2 border-b border-gray-700 rounded-none">
            {title}
          </div>
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
              // @ts-ignore
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
                  // @ts-ignore
                  onInsertSidenote={(editor) => handleInsertSidenote(editor)}
                />
              ) : null
            }
            onCreate={({ editor }) => {
              // @ts-ignore
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
          >
            {/* If no children are required, provide an empty fragment */}
            <></>
          </EditorProvider>
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
