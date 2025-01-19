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
      healthcare_professionals: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          professional_type: Database["public"]["Enums"]["healthcare_professional_type"]
          rpps_number: string | null
          specialty: string | null
          signature: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          last_name: string
          professional_type: Database["public"]["Enums"]["healthcare_professional_type"]
          rpps_number?: string | null
          specialty?: string | null
          signature?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          professional_type?: Database["public"]["Enums"]["healthcare_professional_type"]
          rpps_number?: string | null
          specialty?: string | null
          signature?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      life_support_questions: {
        Row: {
          display_order: number | null
          id: string
          Indécision: string
          "La non souffrance est à privilégier": string
          "Non rapidement abandonner le thérapeutique": string
          Oui: string
          "Oui pour une durée modérée": string
          "Oui seulement si l'équipe médicale le juge utile": string
          question: string
          updated_at: string | null
        }
        Insert: {
          display_order?: number | null
          id?: string
          Indécision: string
          "La non souffrance est à privilégier": string
          "Non rapidement abandonner le thérapeutique": string
          Oui: string
          "Oui pour une durée modérée": string
          "Oui seulement si l'équipe médicale le juge utile": string
          question: string
          updated_at?: string | null
        }
        Update: {
          display_order?: number | null
          id?: string
          Indécision?: string
          "La non souffrance est à privilégier"?: string
          "Non rapidement abandonner le thérapeutique"?: string
          Oui?: string
          "Oui pour une durée modérée"?: string
          "Oui seulement si l'équipe médicale le juge utile"?: string
          question?: string
          updated_at?: string | null
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
          unique_identifier: string
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
          unique_identifier: string
          updated_at?: string | null
        }
        Update: {
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
          unique_identifier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      questionnaire_advanced_illness_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_text: string | null
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_text?: string | null
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_text?: string | null
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
      questionnaire_general_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_text: string | null
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_text?: string | null
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_text?: string | null
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
      questionnaire_life_support_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_text: string | null
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_text?: string | null
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_text?: string | null
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
      questionnaire_preferences_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_text: string | null
          response: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_text?: string | null
          response: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_text?: string | null
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
          JE_NE_SAIS_PAS: string
          NON: string
          order: number | null
          OUI: string
          Question: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["question_category"] | null
          id?: string
          JE_NE_SAIS_PAS?: string
          NON: string
          order?: number | null
          OUI: string
          Question: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"] | null
          id?: string
          JE_NE_SAIS_PAS?: string
          NON?: string
          order?: number | null
          OUI?: string
          Question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trusted_persons: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          postal_code: string | null
          relation: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          postal_code?: string | null
          relation?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          postal_code?: string | null
          relation?: string | null
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
      healthcare_professional_type: "doctor" | "nurse" | "pharmacist" | "other"
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
