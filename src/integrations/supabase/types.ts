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
      articles: {
        Row: {
          category: string
          content: string
          created_at: string | null
          date: string
          id: string
          language: string
          source: string
          title: string
          url: string
          user_id: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          date: string
          id?: string
          language: string
          source: string
          title: string
          url: string
          user_id?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          date?: string
          id?: string
          language?: string
          source?: string
          title?: string
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      directives: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          amount: number
          city: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          postal_code: string
          status: string | null
          stripe_payment_intent_id: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          amount: number
          city: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          postal_code: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          amount?: number
          city?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          postal_code?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pdf_documents: {
        Row: {
          content_type: string | null
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
        }
        Relationships: []
      }
      questionnaire_advanced_illness_en: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_advanced_illness_fr: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_general_en: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_general_fr: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          question: string
          question_order: number | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: string
          question: string
          question_order?: number | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          question?: string
          question_order?: number | null
        }
        Relationships: []
      }
      questionnaire_life_support_en: {
        Row: {
          created_at: string | null
          display_order: number | null
          explanation: string | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          explanation?: string | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_life_support_fr: {
        Row: {
          explanation: string | null
          id: number
          option_no: string
          option_unsure: string
          option_yes: string
          question_order: number
          question_text: string
        }
        Insert: {
          explanation?: string | null
          id?: number
          option_no: string
          option_unsure: string
          option_yes: string
          question_order: number
          question_text: string
        }
        Update: {
          explanation?: string | null
          id?: number
          option_no?: string
          option_unsure?: string
          option_yes?: string
          question_order?: number
          question_text?: string
        }
        Relationships: []
      }
      questionnaire_preferences_en: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_preferences_fr: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      questionnaire_preferences_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          question_text: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string
          question_text: string | null
          questionnaire_type: string
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id: string
          question_text?: string | null
          questionnaire_type: string
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string
          question_text?: string | null
          questionnaire_type?: string
          response?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      questionnaire_synthesis: {
        Row: {
          created_at: string | null
          free_text: string | null
          id: string
          signature: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          free_text?: string | null
          id?: string
          signature?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          free_text?: string | null
          id?: string
          signature?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          helpful_count: number | null
          id: string
          rating: number
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating: number
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trusted_persons: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          relation: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          relation?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          relation?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_signatures: {
        Row: {
          created_at: string | null
          signature_data: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          signature_data: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          signature_data?: string
          updated_at?: string | null
          user_id?: string
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
      [_ in never]: never
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
