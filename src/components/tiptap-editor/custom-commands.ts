import { ChainedCommands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    insertFootnote: {
      /**
       * Insert a new footnote
       */
      insertFootnote: () => ReturnType;
    };
  }
}
