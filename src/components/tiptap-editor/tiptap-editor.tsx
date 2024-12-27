import React, { useState, useEffect } from "react";
import "../../index.css";
import { mergeAttributes, Node, Extension } from "@tiptap/core";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapMenu } from "./tiptap-menu";
import { saveContent } from "./tiptap-utils";
import { TableOfContents } from "@tiptap-pro/extension-table-of-contents";
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
import Highlight from '@tiptap/extension-highlight'
import Youtube from '@tiptap/extension-youtube';
import { ToC } from "./toc";
import { SidenoteEditor } from "../sidenote-editor/sidenote-editor";
import { FloatingLinkMenu } from './floating-link-menu';
import Mathematics from '@tiptap-pro/extension-mathematics'
import Code from '@tiptap/extension-code'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

interface TiptapEditorProps {
  title: any;
  content: any;
  contentId?: string;
  editable?: () => boolean;
  onSidenotePositionsChange: (
    positions: Array<{ id: number; pos: number; yCoordinate: number }>
  ) => void;
  onTocVisibilityChange?: (isVisible: boolean) => void;
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
      HTMLAttributes: {
        class: 'sidenote select-none',
      },
    };
  },

  parseHTML() {
    return [{ tag: "sup.sidenote" }];
  },

  renderHTML({ node }) {
    return [
      "sup",
      mergeAttributes(this.options.HTMLAttributes, { class: "sidenote select-none" }),
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
  onTocVisibilityChange,
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
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto',
      },
    }),
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
    Youtube.configure({
      controls: true,
      nocookie: true,
    }),
    Link.configure({
      openOnClick: true,
      HTMLAttributes: {
        class: 'font-bold underline',
      },
    }),
    Extension.create({
      name: 'customKeyboardShortcuts',
      addKeyboardShortcuts() {
        return {
          'Mod-k': () => {
            const previousUrl = this.editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);

            if (url === null) {
              return true;
            }

            if (url === '') {
              this.editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return true;
            }

            this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            return true;
          },
        }
      },
    }),
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'highlight',
      },
    }),
    TableOfContents.configure({
      onUpdate: (items) => {
        // @ts-ignore
        setTocItems(items);
      },
    }),
    Mathematics.configure({
      katexOptions: {
        throwOnError: false,
        strict: false
      }
    }),
    Code.configure({
      HTMLAttributes: {
        class: 'bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm inline',
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'border-collapse table-auto w-full',
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
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

  useEffect(() => {
    const hasToc = editor?.getHTML().includes('<h1>') || 
                   editor?.getHTML().includes('<h2>') || 
                   editor?.getHTML().includes('<h3>');
    onTocVisibilityChange?.(hasToc);
  }, [editor?.getHTML()]);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex-col w-1/4 table-of-contents-container pr-4 mx-6 hidden lg:flex">
          <div className="table-of-contents-title">
            {title}
          </div>
          <div className="table-of-contents">
            <ToC items={tocItems} editor={editor} />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-3/4 lg:pl-0 pl-6">
          <div className="relative">
            <EditorProvider
              key={key}
              extensions={extensions}
              editorProps={{
                editable,
                attributes: {
                  class: `prose dark:prose-invert prose-base xl:prose-base focus:outline-none max-w-4xl`,
                },
                // @ts-ignore
                handleClickOn: (view, pos, node) => {
                  if (node.type.name === "sidenote") {
                    console.log("Sidenote clicked", {
                      isEditable: editable(),
                      windowWidth: window.innerWidth,
                      nodeId: node.attrs.id
                    });
                    
                    if (editable()) {
                      setCurrentSidenoteId(node.attrs.id);
                      setIsSidenoteEditorOpen(true);
                    } else if (window.innerWidth < 1024) { // lg breakpoint is 1024px
                      console.log("Dispatching sidenote event");
                      const event = new CustomEvent('showSidenote', {
                        detail: { id: node.attrs.id }
                      });
                      window.dispatchEvent(event);
                    }
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
              <>
                {editor && editable() && <FloatingLinkMenu editor={editor} />}
              </>
            </EditorProvider>
          </div>
        </div>
        {isSidenoteEditorOpen && (
          <SidenoteEditor
            isOpen={isSidenoteEditorOpen}
            onClose={() => setIsSidenoteEditorOpen(false)}
            contentId={contentId}
            sidenoteId={currentSidenoteId ?? 0}
          />
        )}
      </div>
    </>
  );
};
