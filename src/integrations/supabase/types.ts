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
      advanced_illness_questions: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          non: string | null
          oui: string | null
          "Oui si l'équipe médicale le juge utile": string | null
          "Oui si ma personne de confiance le juge utile": string | null
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          non?: string | null
          oui?: string | null
          "Oui si l'équipe médicale le juge utile"?: string | null
          "Oui si ma personne de confiance le juge utile"?: string | null
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          non?: string | null
          oui?: string | null
          "Oui si l'équipe médicale le juge utile"?: string | null
          "Oui si ma personne de confiance le juge utile"?: string | null
          question?: string
        }
        Relationships: []
      }
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
      life_support_questions: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          Indécision: string | null
          "La non souffrance est à privilégier": string | null
          "Non rapidement abandonner le thérapeutique": string | null
          Oui: string | null
          "Oui pour une durée modérée": string | null
          "Oui seulement si l'équipe médicale le juge utile": string | null
          question: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          Indécision?: string | null
          "La non souffrance est à privilégier"?: string | null
          "Non rapidement abandonner le thérapeutique"?: string | null
          Oui?: string | null
          "Oui pour une durée modérée"?: string | null
          "Oui seulement si l'équipe médicale le juge utile"?: string | null
          question: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          Indécision?: string | null
          "La non souffrance est à privilégier"?: string | null
          "Non rapidement abandonner le thérapeutique"?: string | null
          Oui?: string | null
          "Oui pour une durée modérée"?: string | null
          "Oui seulement si l'équipe médicale le juge utile"?: string | null
          question?: string
        }
        Relationships: []
      }
      preferences_questions: {
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
      questionnaire_advanced_illness_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          question_text: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_advanced_illness_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "advanced_illness_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_general_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          question_text: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_general_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_life_support_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          question_text: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_life_support_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "life_support_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_preferences_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          question_text: string | null
          response: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          question_text?: string | null
          response?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_preferences_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "preferences_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_synthesis: {
        Row: {
          created_at: string | null
          free_text: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          free_text?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          free_text?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          JE_NE_SAIS_PAS: string | null
          NON: string | null
          OUI: string | null
          Question: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          JE_NE_SAIS_PAS?: string | null
          NON?: string | null
          OUI?: string | null
          Question: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          JE_NE_SAIS_PAS?: string | null
          NON?: string | null
          OUI?: string | null
          Question?: string
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
