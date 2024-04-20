// src/tiptap-utils.ts
import { supabase } from "../../supabase-client";

export const saveContent = async (contentId: string, content: any) => {
  const { error } = await supabase
    .from("reading_details")
    .update({ content })
    .eq("content_id", contentId);

  if (error) {
    console.error("Error saving content:", error);
  }
};
