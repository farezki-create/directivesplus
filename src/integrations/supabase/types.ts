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
      access_code_attempts: {
        Row: {
          access_code: string | null
          attempt_time: string | null
          id: string
          ip_address: unknown
          success: boolean
          user_agent: string | null
        }
        Insert: {
          access_code?: string | null
          attempt_time?: string | null
          id?: string
          ip_address: unknown
          success: boolean
          user_agent?: string | null
        }
        Update: {
          access_code?: string | null
          attempt_time?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      access_logs: {
        Row: {
          access_by: string | null
          access_type: string | null
          accessed_at: string | null
          directive_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          access_by?: string | null
          access_type?: string | null
          accessed_at?: string | null
          directive_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          access_by?: string | null
          access_type?: string | null
          accessed_at?: string | null
          directive_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_directive_id_fkey"
            columns: ["directive_id"]
            isOneToOne: false
            referencedRelation: "directives"
            referencedColumns: ["id"]
          },
        ]
      }
      access_requests: {
        Row: {
          access_code: string
          created_at: string | null
          directive_id: string | null
          id: string
          requester_birthdate: string
          requester_name: string
          status: string | null
        }
        Insert: {
          access_code: string
          created_at?: string | null
          directive_id?: string | null
          id?: string
          requester_birthdate: string
          requester_name: string
          status?: string | null
        }
        Update: {
          access_code?: string
          created_at?: string | null
          directive_id?: string | null
          id?: string
          requester_birthdate?: string
          requester_name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_requests_directive_id_fkey"
            columns: ["directive_id"]
            isOneToOne: false
            referencedRelation: "advance_directives"
            referencedColumns: ["id"]
          },
        ]
      }
      advance_directives: {
        Row: {
          access_code: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_code: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_code?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
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
      configuration: {
        Row: {
          id: number
          key: string
          value: string
        }
        Insert: {
          id?: never
          key: string
          value: string
        }
        Update: {
          id?: never
          key?: string
          value?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      directives: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          institution_code: string | null
          institution_code_expires_at: string | null
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          institution_code?: string | null
          institution_code_expires_at?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          institution_code?: string | null
          institution_code_expires_at?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_access_codes: {
        Row: {
          access_code: string
          created_at: string | null
          current_uses: number | null
          document_id: string | null
          expires_at: string | null
          id: string
          is_full_access: boolean | null
          last_used_at: string | null
          max_uses: number | null
          user_id: string
        }
        Insert: {
          access_code: string
          created_at?: string | null
          current_uses?: number | null
          document_id?: string | null
          expires_at?: string | null
          id?: string
          is_full_access?: boolean | null
          last_used_at?: string | null
          max_uses?: number | null
          user_id: string
        }
        Update: {
          access_code?: string
          created_at?: string | null
          current_uses?: number | null
          document_id?: string | null
          expires_at?: string | null
          id?: string
          is_full_access?: boolean | null
          last_used_at?: string | null
          max_uses?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_access_codes_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "pdf_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_access_logs: {
        Row: {
          access_code_id: string
          date_consultation: string | null
          id: string
          ip_address: string | null
          nom_consultant: string | null
          prenom_consultant: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_code_id: string
          date_consultation?: string | null
          id?: string
          ip_address?: string | null
          nom_consultant?: string | null
          prenom_consultant?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_code_id?: string
          date_consultation?: string | null
          id?: string
          ip_address?: string | null
          nom_consultant?: string | null
          prenom_consultant?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dossiers_medicaux: {
        Row: {
          code_acces: string
          contenu_dossier: Json
          cree_le: string | null
          id: string
        }
        Insert: {
          code_acces: string
          contenu_dossier: Json
          cree_le?: string | null
          id?: string
        }
        Update: {
          code_acces?: string
          contenu_dossier?: Json
          cree_le?: string | null
          id?: string
        }
        Relationships: []
      }
      health_news: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          publication_date: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          publication_date?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          publication_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      health_news_media: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number | null
          id: string
          media_name: string
          media_size: number | null
          media_type: string
          media_url: string
          mime_type: string | null
          news_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          media_name: string
          media_size?: number | null
          media_type: string
          media_url: string
          mime_type?: string | null
          news_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          media_name?: string
          media_size?: number | null
          media_type?: string
          media_url?: string
          mime_type?: string | null
          news_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_news_media_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "health_news"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_access_codes: {
        Row: {
          auto_expires_at: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          institution_code: string
          institution_name: string | null
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_expires_at?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          institution_code: string
          institution_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_expires_at?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          institution_code?: string
          institution_name?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      institution_access_logs: {
        Row: {
          access_type: string | null
          accessed_at: string | null
          id: string
          institution_code_id: string
          institution_name: string | null
          ip_address: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type?: string | null
          accessed_at?: string | null
          id?: string
          institution_code_id: string
          institution_name?: string | null
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string | null
          accessed_at?: string | null
          id?: string
          institution_code_id?: string
          institution_name?: string | null
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "institution_access_logs_institution_code_id_fkey"
            columns: ["institution_code_id"]
            isOneToOne: false
            referencedRelation: "institution_access_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_acces: {
        Row: {
          details: string | null
          dossier_id: string | null
          id: string
          succes: boolean
          timestamp_acces: string | null
        }
        Insert: {
          details?: string | null
          dossier_id?: string | null
          id?: string
          succes: boolean
          timestamp_acces?: string | null
        }
        Update: {
          details?: string | null
          dossier_id?: string | null
          id?: string
          succes?: boolean
          timestamp_acces?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_acces_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers_medicaux"
            referencedColumns: ["id"]
          },
        ]
      }
      mailer_config: {
        Row: {
          config: Json | null
          id: number
        }
        Insert: {
          config?: Json | null
          id?: never
        }
        Update: {
          config?: Json | null
          id?: never
        }
        Relationships: []
      }
      medical_access_audit: {
        Row: {
          access_granted: boolean
          access_method: string
          accessed_at: string | null
          additional_context: Json | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          resource_id: string
          resource_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_granted: boolean
          access_method: string
          accessed_at?: string | null
          additional_context?: Json | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id: string
          resource_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_granted?: boolean
          access_method?: string
          accessed_at?: string | null
          additional_context?: Json | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string
          resource_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      medical_data: {
        Row: {
          access_code: string
          blood_type: string | null
          created_at: string | null
          data: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_code: string
          blood_type?: string | null
          created_at?: string | null
          data: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_code?: string
          blood_type?: string | null
          created_at?: string | null
          data?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medical_data_access_requests: {
        Row: {
          access_code: string
          created_at: string | null
          id: string
          medical_data_id: string | null
          requester_birthdate: string
          requester_name: string
          status: string | null
        }
        Insert: {
          access_code: string
          created_at?: string | null
          id?: string
          medical_data_id?: string | null
          requester_birthdate: string
          requester_name: string
          status?: string | null
        }
        Update: {
          access_code?: string
          created_at?: string | null
          id?: string
          medical_data_id?: string | null
          requester_birthdate?: string
          requester_name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_data_access_requests_medical_data_id_fkey"
            columns: ["medical_data_id"]
            isOneToOne: false
            referencedRelation: "medical_data"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_documents: {
        Row: {
          created_at: string
          description: string
          extracted_content: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          extracted_content?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          extracted_content?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
          external_id: string | null
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
          external_id?: string | null
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
          external_id?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
          user_id?: string
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
          medical_access_code: string | null
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
          medical_access_code?: string | null
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
          medical_access_code?: string | null
          phone_number?: string | null
          postal_code?: string | null
        }
        Relationships: []
      }
      questionnaire_advanced_illness_en: {
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
      questionnaire_advanced_illness_fr: {
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
      questionnaire_general_en: {
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
      questionnaire_general_fr: {
        Row: {
          created_at: string | null
          display_order: number
          explanation: string | null
          id: string
          question: string
          question_order: number | null
        }
        Insert: {
          created_at?: string | null
          display_order: number
          explanation?: string | null
          id?: string
          question: string
          question_order?: number | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          explanation?: string | null
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
      questionnaire_medical: {
        Row: {
          activite_physique: boolean | null
          adresse: string | null
          alcool: boolean | null
          allergies: string[] | null
          antecedents: string | null
          autres_chirurgies: string | null
          autres_symptomes: string | null
          chirurgies: string[] | null
          contexte_social_couverture: string | null
          contexte_social_profession: string | null
          contexte_social_vie: string | null
          created_at: string
          date_naissance: string | null
          debut_symptomes: string | null
          details_motif: string | null
          directives: string | null
          dispositifs: string | null
          drogues: boolean | null
          evolution: string | null
          famille: string[] | null
          hospitalisations: string | null
          id: string
          motif: string | null
          nom: string | null
          pathologies: string[] | null
          personne_prevenir: string | null
          prenom: string | null
          secu: string | null
          sexe: string | null
          symptomes: string[] | null
          tabac: boolean | null
          telephone: string | null
          traitements: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activite_physique?: boolean | null
          adresse?: string | null
          alcool?: boolean | null
          allergies?: string[] | null
          antecedents?: string | null
          autres_chirurgies?: string | null
          autres_symptomes?: string | null
          chirurgies?: string[] | null
          contexte_social_couverture?: string | null
          contexte_social_profession?: string | null
          contexte_social_vie?: string | null
          created_at?: string
          date_naissance?: string | null
          debut_symptomes?: string | null
          details_motif?: string | null
          directives?: string | null
          dispositifs?: string | null
          drogues?: boolean | null
          evolution?: string | null
          famille?: string[] | null
          hospitalisations?: string | null
          id?: string
          motif?: string | null
          nom?: string | null
          pathologies?: string[] | null
          personne_prevenir?: string | null
          prenom?: string | null
          secu?: string | null
          sexe?: string | null
          symptomes?: string[] | null
          tabac?: boolean | null
          telephone?: string | null
          traitements?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activite_physique?: boolean | null
          adresse?: string | null
          alcool?: boolean | null
          allergies?: string[] | null
          antecedents?: string | null
          autres_chirurgies?: string | null
          autres_symptomes?: string | null
          chirurgies?: string[] | null
          contexte_social_couverture?: string | null
          contexte_social_profession?: string | null
          contexte_social_vie?: string | null
          created_at?: string
          date_naissance?: string | null
          debut_symptomes?: string | null
          details_motif?: string | null
          directives?: string | null
          dispositifs?: string | null
          drogues?: boolean | null
          evolution?: string | null
          famille?: string[] | null
          hospitalisations?: string | null
          id?: string
          motif?: string | null
          nom?: string | null
          pathologies?: string[] | null
          personne_prevenir?: string | null
          prenom?: string | null
          secu?: string | null
          sexe?: string | null
          symptomes?: string[] | null
          tabac?: boolean | null
          telephone?: string | null
          traitements?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_preferences_en: {
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
      questionnaire_preferences_fr: {
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
      security_audit_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shared_documents: {
        Row: {
          access_code: string | null
          document_data: Json
          document_id: string
          document_type: string
          expires_at: string | null
          id: string
          is_active: boolean
          shared_at: string
          user_id: string
        }
        Insert: {
          access_code?: string | null
          document_data: Json
          document_id: string
          document_type: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          shared_at?: string
          user_id: string
        }
        Update: {
          access_code?: string | null
          document_data?: Json
          document_id?: string
          document_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          shared_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_profiles: {
        Row: {
          access_code: string
          birthdate: string
          created_at: string | null
          expires_at: string | null
          first_name: string
          id: string
          last_name: string
          medical_profile_id: string | null
          user_id: string | null
        }
        Insert: {
          access_code: string
          birthdate: string
          created_at?: string | null
          expires_at?: string | null
          first_name: string
          id?: string
          last_name: string
          medical_profile_id?: string | null
          user_id?: string | null
        }
        Update: {
          access_code?: string
          birthdate?: string
          created_at?: string | null
          expires_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          medical_profile_id?: string | null
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
      user_profiles: {
        Row: {
          birth_date: string | null
          first_name: string | null
          id: string
          institution_shared_code: string | null
          last_name: string | null
        }
        Insert: {
          birth_date?: string | null
          first_name?: string | null
          id: string
          institution_shared_code?: string | null
          last_name?: string | null
        }
        Update: {
          birth_date?: string | null
          first_name?: string | null
          id?: string
          institution_shared_code?: string | null
          last_name?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      check_access_code_rate_limit: {
        Args: {
          p_ip_address: unknown
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit_secure: {
        Args: {
          p_identifier: string
          p_attempt_type: string
          p_max_attempts?: number
          p_window_minutes?: number
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: {
          allowed: boolean
          remaining_attempts: number
          retry_after: number
        }[]
      }
      debug_institution_access_step_by_step: {
        Args: {
          input_last_name: string
          input_first_name: string
          input_birth_date: string
          input_shared_code: string
        }
        Returns: {
          step_name: string
          found_count: number
          details: string
        }[]
      }
      debug_patient_by_lastname: {
        Args: { input_last_name: string }
        Returns: {
          user_id: string
          profile_id: string
          first_name: string
          last_name: string
          birth_date: string
          institution_shared_code: string
        }[]
      }
      generate_institution_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_code: {
        Args: { length: number }
        Returns: string
      }
      generate_shared_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_access_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_directives_by_institution_code: {
        Args: {
          input_nom: string
          input_prenom: string
          input_date_naissance: string
          input_institution_code: string
        }
        Returns: {
          id: string
          user_id: string
          content: Json
          created_at: string
        }[]
      }
      get_directives_by_shared_code: {
        Args: {
          input_nom: string
          input_prenom: string
          input_date_naissance: string
          input_shared_code: string
        }
        Returns: {
          id: string
          user_id: string
          titre: string
          contenu: string
          created_at: string
        }[]
      }
      get_documents_with_access_code: {
        Args: {
          p_last_name: string
          p_first_name: string
          p_birth_date: string
          p_access_code: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: {
          document_id: string
          is_full_access: boolean
          user_id: string
          access_code_id: string
        }[]
      }
      get_institution_directives_complete: {
        Args: {
          input_last_name: string
          input_first_name: string
          input_birth_date: string
          input_institution_code: string
        }
        Returns: {
          access_granted: boolean
          user_id: string
          patient_info: Json
          directives: Json
          documents: Json
        }[]
      }
      get_patient_directives_by_institution: {
        Args: {
          input_last_name: string
          input_first_name: string
          input_birth_date: string
          input_institution_code: string
        }
        Returns: {
          directive_id: string
          directive_content: Json
          created_at: string
          patient_info: Json
        }[]
      }
      get_patient_directives_by_institution_access: {
        Args: {
          input_last_name: string
          input_first_name: string
          input_birth_date: string
          input_shared_code: string
        }
        Returns: {
          id: string
          last_name: string
          first_name: string
          birth_date: string
          institution_shared_code: string
        }[]
      }
      get_public_document: {
        Args: { doc_id: string }
        Returns: {
          id: string
          file_name: string
          file_path: string
          content_type: string
          user_id: string
          created_at: string
          description: string
          file_size: number
          updated_at: string
          external_id: string
        }[]
      }
      get_shared_documents_by_access_code: {
        Args: {
          input_access_code: string
          input_first_name?: string
          input_last_name?: string
          input_birth_date?: string
        }
        Returns: {
          document_id: string
          document_type: string
          document_data: Json
          user_id: string
          shared_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          _event_type: string
          _user_id?: string
          _ip_address?: unknown
          _user_agent?: string
          _details?: Json
          _risk_level?: string
        }
        Returns: undefined
      }
      log_security_event_enhanced: {
        Args: {
          p_event_type: string
          p_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_details?: Json
          p_risk_level?: string
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: string
      }
      log_security_event_secure: {
        Args: {
          p_event_type: string
          p_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_details?: Json
          p_risk_level?: string
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: string
      }
      secure_document_access: {
        Args: {
          p_document_id: string
          p_access_method: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_session_id?: string
        }
        Returns: {
          id: string
          file_name: string
          file_path: string
          content_type: string
          user_id: string
          access_granted: boolean
        }[]
      }
      validate_and_use_access_code: {
        Args: {
          _access_code: string
          _ip_address?: unknown
          _user_agent?: string
        }
        Returns: {
          is_valid: boolean
          document_id: string
          user_id: string
          error_message: string
        }[]
      }
      validate_secure_document_access: {
        Args: {
          p_document_id: string
          p_access_code?: string
          p_user_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: {
          access_granted: boolean
          document_data: Json
          error_message: string
        }[]
      }
      verify_access_identity: {
        Args: {
          input_lastname: string
          input_firstname: string
          input_birthdate: string
          input_access_code: string
        }
        Returns: {
          access_code: string
          birthdate: string
          created_at: string | null
          expires_at: string | null
          first_name: string
          id: string
          last_name: string
          medical_profile_id: string | null
          user_id: string | null
        }[]
      }
      verify_directive_access: {
        Args: {
          p_directive_id: string
          p_name: string
          p_birthdate: string
          p_access_code: string
        }
        Returns: {
          is_valid: boolean
          directive_content: string
        }[]
      }
      verify_document_access: {
        Args: {
          p_access_code: string
          p_first_name: string
          p_last_name: string
          p_birth_date: string
        }
        Returns: {
          document_id: string
          is_full_access: boolean
        }[]
      }
      verify_institution_access: {
        Args: {
          input_last_name: string
          input_first_name: string
          input_birth_date: string
          input_institution_code: string
        }
        Returns: {
          user_id: string
          first_name: string
          last_name: string
          birth_date: string
          institution_code_valid: boolean
        }[]
      }
      verify_medical_data_access: {
        Args: {
          p_medical_data_id: string
          p_name: string
          p_birthdate: string
          p_access_code: string
        }
        Returns: {
          is_valid: boolean
          medical_data_content: Json
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
