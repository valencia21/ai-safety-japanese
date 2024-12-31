export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      reading_details: {
        Row: {
          author: string | null
          content: Json | null
          content_id: string | null
          created_at: string
          id: number
          image: string | null
          link_to_original: string | null
          original_title: string | null
          project_id: Database["public"]["Enums"]["project_type"]
          proofreader: Database["public"]["Enums"]["team"] | null
          sidenotes: Json | null
          time_to_read: string | null
          title: string | null
          translator: Database["public"]["Enums"]["team"] | null
        }
        Insert: {
          author?: string | null
          content?: Json | null
          content_id?: string | null
          created_at?: string
          id?: number
          image?: string | null
          link_to_original?: string | null
          original_title?: string | null
          project_id?: Database["public"]["Enums"]["project_type"]
          proofreader?: Database["public"]["Enums"]["team"] | null
          sidenotes?: Json | null
          time_to_read?: string | null
          title?: string | null
          translator?: Database["public"]["Enums"]["team"] | null
        }
        Update: {
          author?: string | null
          content?: Json | null
          content_id?: string | null
          created_at?: string
          id?: number
          image?: string | null
          link_to_original?: string | null
          original_title?: string | null
          project_id?: Database["public"]["Enums"]["project_type"]
          proofreader?: Database["public"]["Enums"]["team"] | null
          sidenotes?: Json | null
          time_to_read?: string | null
          title?: string | null
          translator?: Database["public"]["Enums"]["team"] | null
        }
        Relationships: []
      }
      reading_overview: {
        Row: {
          content_id: string | null
          created_at: string
          description: string | null
          format: Database["public"]["Enums"]["format"] | null
          id: number
          order: number | null
          original_title: string | null
          project_id: Database["public"]["Enums"]["project_type"]
          required_reading: boolean | null
          revision_url: string | null
          session_number: number | null
          status: Database["public"]["Enums"]["status"] | null
          title: string | null
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          format?: Database["public"]["Enums"]["format"] | null
          id?: number
          order?: number | null
          original_title?: string | null
          project_id?: Database["public"]["Enums"]["project_type"]
          required_reading?: boolean | null
          revision_url?: string | null
          session_number?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          title?: string | null
        }
        Update: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          format?: Database["public"]["Enums"]["format"] | null
          id?: number
          order?: number | null
          original_title?: string | null
          project_id?: Database["public"]["Enums"]["project_type"]
          required_reading?: boolean | null
          revision_url?: string | null
          session_number?: number | null
          status?: Database["public"]["Enums"]["status"] | null
          title?: string | null
        }
        Relationships: []
      }
      session_overview: {
        Row: {
          created_at: string
          description: string | null
          id: number
          project_id: Database["public"]["Enums"]["project_type"]
          session_counter_jp: string | null
          session_number: number | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: Database["public"]["Enums"]["project_type"]
          session_counter_jp?: string | null
          session_number?: number | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          project_id?: Database["public"]["Enums"]["project_type"]
          session_counter_jp?: string | null
          session_number?: number | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      format: "記事" | "ビデオ" | "ブログ" | "レポート" | "研究"
      project_type: "ai_safety" | "animal_welfare"
      status: "pending" | "published"
      team:
        | "Masayuki Nagai"
        | "bioshok"
        | "Ryota Takatsuki"
        | "Shinnosuke Uesaka"
        | "Amane Watahiki"
        | "Masaya Sasaki"
        | "Luis Costigan"
        | "Nanako Murata"
        | "Kosei Kawahara"
        | "Masashi Takeshita"
        | "Taiga Shinozaki"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
