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
          created_at: string
          id: string
          non: string
          order: number | null
          oui: string
          "Oui si l'équipe médicale le juge utile": string
          "Oui si ma personne de confiance le juge utile": string
          question: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          non: string
          order?: number | null
          oui: string
          "Oui si l'équipe médicale le juge utile": string
          "Oui si ma personne de confiance le juge utile": string
          question: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          non?: string
          order?: number | null
          oui?: string
          "Oui si l'équipe médicale le juge utile"?: string
          "Oui si ma personne de confiance le juge utile"?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_access: {
        Row: {
          access_code: string
          created_at: string
          document_id: string
          email: string
          expires_at: string
          id: string
          is_active: boolean | null
          used_at: string | null
        }
        Insert: {
          access_code: string
          created_at?: string
          document_id: string
          email: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          used_at?: string | null
        }
        Update: {
          access_code?: string
          created_at?: string
          document_id?: string
          email?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      life_support_questions: {
        Row: {
          id: string
          Indécision: string
          "La non souffrance est à privilégier": string
          "Non rapidement abandonner le thérapeutique": string
          Oui: string
          "Oui pour une durée modérée": string
          "Oui seulement si l'équipe médicale le juge utile": string
          question: string
        }
        Insert: {
          id?: string
          Indécision: string
          "La non souffrance est à privilégier": string
          "Non rapidement abandonner le thérapeutique": string
          Oui: string
          "Oui pour une durée modérée": string
          "Oui seulement si l'équipe médicale le juge utile": string
          question: string
        }
        Update: {
          id?: string
          Indécision?: string
          "La non souffrance est à privilégier"?: string
          "Non rapidement abandonner le thérapeutique"?: string
          Oui?: string
          "Oui pour une durée modérée"?: string
          "Oui seulement si l'équipe médicale le juge utile"?: string
          question?: string
        }
        Relationships: []
      }
      preferences_questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"] | null
          created_at: string
          display_order: number | null
          id: string
          question: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["question_category"] | null
          created_at?: string
          display_order?: number | null
          id?: string
          question: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"] | null
          created_at?: string
          display_order?: number | null
          id?: string
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      questionnaire_advanced_illness_answers: {
        Row: {
          answer_id: string
          question_id: string
        }
        Insert: {
          answer_id: string
          question_id: string
        }
        Update: {
          answer_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_advanced_illness_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_advanced_illness_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "advanced_illness_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_advanced_illness_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: string
          updated_at?: string | null
          user_id?: string
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
      questionnaire_answers: {
        Row: {
          answer: string
          created_at: string
          id: string
          question_id: string
          questionnaire_type: Database["public"]["Enums"]["questionnaire_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question_id: string
          questionnaire_type: Database["public"]["Enums"]["questionnaire_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question_id?: string
          questionnaire_type?: Database["public"]["Enums"]["questionnaire_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_general_opinion_answers: {
        Row: {
          answer_id: string
          question_id: string
        }
        Insert: {
          answer_id: string
          question_id: string
        }
        Update: {
          answer_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_general_opinion_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_general_opinion_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_general_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: string
          updated_at?: string | null
          user_id?: string
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
      questionnaire_life_support_answers: {
        Row: {
          answer_id: string
          question_id: string
        }
        Insert: {
          answer_id: string
          question_id: string
        }
        Update: {
          answer_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_life_support_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_life_support_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "life_support_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_life_support_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: string
          updated_at?: string | null
          user_id?: string
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
      questionnaire_preferences_answers: {
        Row: {
          answer_id: string
          question_id: string
        }
        Insert: {
          answer_id: string
          question_id: string
        }
        Update: {
          answer_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_preferences_answers_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_preferences_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "preferences_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_preferences_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response?: string
          updated_at?: string | null
          user_id?: string
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
          created_at: string
          free_text: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          free_text?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          free_text?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"] | null
          id: string
          NON: string
          order: number | null
          OUI: string
          Question: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["question_category"] | null
          id?: string
          NON: string
          order?: number | null
          OUI: string
          Question: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"] | null
          id?: string
          NON?: string
          order?: number | null
          OUI?: string
          Question?: string
          updated_at?: string | null
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
      question_category:
        | "general_opinion"
        | "other_directives"
        | "life_support"
        | "pain_relief"
        | "let_die"
      question_type: "simple" | "detailed"
      questionnaire_type:
        | "general_opinion"
        | "life_support"
        | "advanced_illness"
        | "preferences"
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
