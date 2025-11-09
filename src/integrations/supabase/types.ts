export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      abonnes_institutions: {
        Row: {
          created_at: string | null
          date_validation: string | null
          email: string
          est_valide: boolean | null
          id: string
          nom: string
          structure: string
          structure_autorisee: string | null
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_validation?: string | null
          email: string
          est_valide?: boolean | null
          id?: string
          nom: string
          structure: string
          structure_autorisee?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_validation?: string | null
          email?: string
          est_valide?: boolean | null
          id?: string
          nom?: string
          structure?: string
          structure_autorisee?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
      agenda: {
        Row: {
          commentaire: string | null
          date_heure: string | null
          id: string
          intervenant: string | null
          patient_id: string | null
          type_acte: string | null
        }
        Insert: {
          commentaire?: string | null
          date_heure?: string | null
          id?: string
          intervenant?: string | null
          patient_id?: string | null
          type_acte?: string | null
        }
        Update: {
          commentaire?: string | null
          date_heure?: string | null
          id?: string
          intervenant?: string | null
          patient_id?: string | null
          type_acte?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_notifications_sent: {
        Row: {
          contact_id: string | null
          error_message: string | null
          id: string
          message_content: string | null
          notification_type: string
          patient_id: string
          recipient_contact: string
          sent_at: string | null
          status: string | null
          symptom_tracking_id: string | null
        }
        Insert: {
          contact_id?: string | null
          error_message?: string | null
          id?: string
          message_content?: string | null
          notification_type: string
          patient_id: string
          recipient_contact: string
          sent_at?: string | null
          status?: string | null
          symptom_tracking_id?: string | null
        }
        Update: {
          contact_id?: string | null
          error_message?: string | null
          id?: string
          message_content?: string | null
          notification_type?: string
          patient_id?: string
          recipient_contact?: string
          sent_at?: string | null
          status?: string | null
          symptom_tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_notifications_sent_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "patient_alert_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_notifications_sent_symptom_tracking_id_fkey"
            columns: ["symptom_tracking_id"]
            isOneToOne: false
            referencedRelation: "symptom_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      alertes: {
        Row: {
          acquittee_le: string | null
          acquittee_par: string | null
          date_declenchement: string
          details: string | null
          id: string
          notifie_a: string[] | null
          patient_id: string
          statut: string
          type_alerte: string
        }
        Insert: {
          acquittee_le?: string | null
          acquittee_par?: string | null
          date_declenchement?: string
          details?: string | null
          id?: string
          notifie_a?: string[] | null
          patient_id: string
          statut?: string
          type_alerte: string
        }
        Update: {
          acquittee_le?: string | null
          acquittee_par?: string | null
          date_declenchement?: string
          details?: string | null
          id?: string
          notifie_a?: string[] | null
          patient_id?: string
          statut?: string
          type_alerte?: string
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
      auth_codes: {
        Row: {
          channel: string
          code: string
          created_at: string
          expires_at: string
          id: string
          target: string
          used: boolean
          user_id: string | null
        }
        Insert: {
          channel: string
          code: string
          created_at?: string
          expires_at: string
          id?: string
          target: string
          used?: boolean
          user_id?: string | null
        }
        Update: {
          channel?: string
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          target?: string
          used?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      auth_codes_2fa: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          ip_address: unknown
          used: boolean
          user_agent: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          used?: boolean
          user_agent?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          used?: boolean
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      auth_codes_verification: {
        Row: {
          code: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          ip_address: unknown
          used: boolean
          user_agent: string | null
          user_id: string | null
          verification_type: string
        }
        Insert: {
          code: string
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          used?: boolean
          user_agent?: string | null
          user_id?: string | null
          verification_type?: string
        }
        Update: {
          code?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          used?: boolean
          user_agent?: string | null
          user_id?: string | null
          verification_type?: string
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
      droits_acces_nominal: {
        Row: {
          abonne_id: string
          created_by: string | null
          date_autorisation: string | null
          id: string
          notes: string | null
          patient_naissance: string
          patient_nom: string
          patient_prenom: string
        }
        Insert: {
          abonne_id: string
          created_by?: string | null
          date_autorisation?: string | null
          id?: string
          notes?: string | null
          patient_naissance: string
          patient_nom: string
          patient_prenom: string
        }
        Update: {
          abonne_id?: string
          created_by?: string | null
          date_autorisation?: string | null
          id?: string
          notes?: string | null
          patient_naissance?: string
          patient_nom?: string
          patient_prenom?: string
        }
        Relationships: [
          {
            foreignKeyName: "droits_acces_nominal_abonne_id_fkey"
            columns: ["abonne_id"]
            isOneToOne: false
            referencedRelation: "abonnes_institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_questions: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number
          id: string
          is_active: boolean | null
          options: Json | null
          question_text: string
          question_type: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order: number
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text: string
          question_type: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          is_active?: boolean | null
          options?: Json | null
          question_text?: string
          question_type?: string
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          response_value: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_value: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_value?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "feedback_questions"
            referencedColumns: ["id"]
          },
        ]
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
      institution_structure_access: {
        Row: {
          created_by: string | null
          date_autorisation: string | null
          id: string
          institution_id: string | null
          notes: string | null
          structure_id: string | null
        }
        Insert: {
          created_by?: string | null
          date_autorisation?: string | null
          id?: string
          institution_id?: string | null
          notes?: string | null
          structure_id?: string | null
        }
        Update: {
          created_by?: string | null
          date_autorisation?: string | null
          id?: string
          institution_id?: string | null
          notes?: string | null
          structure_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_structure_access_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "abonnes_institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_structure_access_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures_soins"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          institution_id: string
          institution_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_start: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          institution_id: string
          institution_type: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          institution_id?: string
          institution_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_start?: string | null
          updated_at?: string
        }
        Relationships: []
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
          is_private: boolean | null
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
          is_private?: boolean | null
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
          is_private?: boolean | null
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
      patient_alert_contacts: {
        Row: {
          contact_name: string
          contact_type: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          patient_id: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          contact_name: string
          contact_type: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          patient_id: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_name?: string
          contact_type?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_alert_settings: {
        Row: {
          alert_threshold: number | null
          auto_alert_enabled: boolean | null
          created_at: string | null
          id: string
          patient_id: string
          phone_number: string | null
          sms_enabled: boolean | null
          sms_provider: string | null
          symptom_types: string[] | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          alert_threshold?: number | null
          auto_alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          patient_id: string
          phone_number?: string | null
          sms_enabled?: boolean | null
          sms_provider?: string | null
          symptom_types?: string[] | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          alert_threshold?: number | null
          auto_alert_enabled?: boolean | null
          created_at?: string | null
          id?: string
          patient_id?: string
          phone_number?: string | null
          sms_enabled?: boolean | null
          sms_provider?: string | null
          symptom_types?: string[] | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          access_code: string | null
          access_code_expires_at: string | null
          created_at: string | null
          date_of_birth: string
          id: string
          name: string
          structure: string | null
        }
        Insert: {
          access_code?: string | null
          access_code_expires_at?: string | null
          created_at?: string | null
          date_of_birth: string
          id?: string
          name: string
          structure?: string | null
        }
        Update: {
          access_code?: string | null
          access_code_expires_at?: string | null
          created_at?: string | null
          date_of_birth?: string
          id?: string
          name?: string
          structure?: string | null
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
          file_type: string | null
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
          file_type?: string | null
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
          file_type?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      plan_soins: {
        Row: {
          auteur: string | null
          contenu: string | null
          date_mise_a_jour: string | null
          id: string
          patient_id: string | null
        }
        Insert: {
          auteur?: string | null
          contenu?: string | null
          date_mise_a_jour?: string | null
          id?: string
          patient_id?: string | null
        }
        Update: {
          auteur?: string | null
          contenu?: string | null
          date_mise_a_jour?: string | null
          id?: string
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_soins_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
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
          shared_document: Json | null
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
          shared_document?: Json | null
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
          shared_document?: Json | null
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
          ip_address: unknown
          risk_level: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          risk_level?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
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
      sms_codes: {
        Row: {
          code: string
          created_at: string | null
          phone_number: string
        }
        Insert: {
          code: string
          created_at?: string | null
          phone_number: string
        }
        Update: {
          code?: string
          created_at?: string | null
          phone_number?: string
        }
        Relationships: []
      }
      sms_rate_limits: {
        Row: {
          created_at: string | null
          id: string
          sms_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          sms_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          sms_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      sms_send_logs: {
        Row: {
          brevo_message_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown
          message_content: string
          recipient_phone: string
          sender_name: string | null
          sent_at: string | null
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          brevo_message_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          message_content: string
          recipient_phone: string
          sender_name?: string | null
          sent_at?: string | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          brevo_message_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          message_content?: string
          recipient_phone?: string
          sender_name?: string | null
          sent_at?: string | null
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      structures_soins: {
        Row: {
          adresse: string | null
          code_postal: string | null
          created_at: string | null
          email: string | null
          id: string
          nom: string
          telephone: string | null
          type_structure: string
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nom: string
          telephone?: string | null
          type_structure: string
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nom?: string
          telephone?: string | null
          type_structure?: string
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: []
      }
      symptom_access_logs: {
        Row: {
          access_code: string
          accessed_at: string | null
          accessor_birth_date: string
          accessor_first_name: string
          accessor_name: string
          id: string
          ip_address: unknown
          patient_id: string
          success: boolean
          user_agent: string | null
        }
        Insert: {
          access_code: string
          accessed_at?: string | null
          accessor_birth_date: string
          accessor_first_name: string
          accessor_name: string
          id?: string
          ip_address?: unknown
          patient_id: string
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          access_code?: string
          accessed_at?: string | null
          accessor_birth_date?: string
          accessor_first_name?: string
          accessor_name?: string
          id?: string
          ip_address?: unknown
          patient_id?: string
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      symptom_tracking: {
        Row: {
          anxiete: number
          auteur: string
          created_at: string
          douleur: number
          dyspnee: number
          fatigue: number | null
          id: string
          patient_id: string
          remarque: string | null
          shared_access_expires_at: string | null
          sommeil: number | null
          symptome_access_code: string | null
          updated_at: string
        }
        Insert: {
          anxiete: number
          auteur?: string
          created_at?: string
          douleur: number
          dyspnee: number
          fatigue?: number | null
          id?: string
          patient_id: string
          remarque?: string | null
          shared_access_expires_at?: string | null
          sommeil?: number | null
          symptome_access_code?: string | null
          updated_at?: string
        }
        Update: {
          anxiete?: number
          auteur?: string
          created_at?: string
          douleur?: number
          dyspnee?: number
          fatigue?: number | null
          id?: string
          patient_id?: string
          remarque?: string | null
          shared_access_expires_at?: string | null
          sommeil?: number | null
          symptome_access_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      symptomes: {
        Row: {
          created_at: string | null
          id: number
          patient_id: string | null
          severity: number
          symptom_name: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          patient_id?: string | null
          severity: number
          symptom_name: string
        }
        Update: {
          created_at?: string | null
          id?: never
          patient_id?: string | null
          severity?: number
          symptom_name?: string
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
      uploaded_documents: {
        Row: {
          content_type: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_temporary: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_temporary?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_temporary?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_otp: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
          updated_at: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          otp_code: string
          updated_at?: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          updated_at?: string
          used?: boolean
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          adresse: string | null
          alert_contacts: Json | null
          alert_settings: Json | null
          created_at: string | null
          date_naissance: string | null
          email: string
          id: string
          nom: string | null
          prenom: string | null
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          adresse?: string | null
          alert_contacts?: Json | null
          alert_settings?: Json | null
          created_at?: string | null
          date_naissance?: string | null
          email: string
          id: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          adresse?: string | null
          alert_contacts?: Json | null
          alert_settings?: Json | null
          created_at?: string | null
          date_naissance?: string | null
          email?: string
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string | null
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
      user_sessions: {
        Row: {
          browser_fingerprint: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser_fingerprint?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser_fingerprint?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
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
      check_access_code_rate_limit: {
        Args: {
          p_ip_address: unknown
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit_secure:
        | {
            Args: {
              p_attempt_type: string
              p_identifier: string
              p_ip_address?: unknown
              p_max_attempts?: number
              p_user_agent?: string
              p_window_minutes?: number
            }
            Returns: {
              allowed: boolean
              remaining_attempts: number
              retry_after: number
            }[]
          }
        | { Args: never; Returns: undefined }
      check_sms_rate_limit:
        | {
            Args: { p_max_sms_per_hour?: number; p_user_id: string }
            Returns: boolean
          }
        | { Args: never; Returns: undefined }
      cleanup_expired_2fa_codes: { Args: never; Returns: undefined }
      cleanup_expired_auth_codes: { Args: never; Returns: undefined }
      cleanup_expired_otp_codes: { Args: never; Returns: undefined }
      cleanup_expired_verification_codes: { Args: never; Returns: undefined }
      cleanup_old_security_logs: { Args: never; Returns: undefined }
      create_user_session: {
        Args: { user_email: string; user_otp: string }
        Returns: string
      }
      debug_institution_access_step_by_step: {
        Args: {
          input_birth_date: string
          input_first_name: string
          input_last_name: string
          input_shared_code: string
        }
        Returns: {
          details: string
          found_count: number
          step_name: string
        }[]
      }
      debug_patient_by_lastname: {
        Args: { input_last_name: string }
        Returns: {
          birth_date: string
          first_name: string
          institution_shared_code: string
          last_name: string
          profile_id: string
          user_id: string
        }[]
      }
      generate_2fa_code: {
        Args: {
          p_email: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      generate_auth_code:
        | {
            Args: { p_channel: string; p_target: string; p_user_id?: string }
            Returns: string
          }
        | { Args: never; Returns: undefined }
      generate_confirmation_code: {
        Args: { target_email: string }
        Returns: string
      }
      generate_institution_code: { Args: never; Returns: string }
      generate_patient_access_code: { Args: never; Returns: string }
      generate_random_code:
        | { Args: { length: number }; Returns: string }
        | { Args: never; Returns: string }
      generate_shared_access_code: { Args: never; Returns: string }
      generate_symptom_access_code: { Args: never; Returns: string }
      generate_unique_access_code: { Args: never; Returns: string }
      generate_verification_code: {
        Args: {
          p_email: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_user_id?: string
          p_verification_type?: string
        }
        Returns: string
      }
      get_anonymized_access_logs: {
        Args: { end_date: string; start_date: string }
        Returns: {
          access_date: string
          action_type: string
          resource_type: string
          success: boolean
        }[]
      }
      get_directives_by_institution_code: {
        Args: {
          input_date_naissance: string
          input_institution_code: string
          input_nom: string
          input_prenom: string
        }
        Returns: {
          content: Json
          created_at: string
          id: string
          user_id: string
        }[]
      }
      get_directives_by_shared_code: {
        Args: {
          input_date_naissance: string
          input_nom: string
          input_prenom: string
          input_shared_code: string
        }
        Returns: {
          contenu: string
          created_at: string
          id: string
          titre: string
          user_id: string
        }[]
      }
      get_documents_with_access_code: {
        Args: {
          p_access_code: string
          p_birth_date: string
          p_first_name: string
          p_ip_address?: string
          p_last_name: string
          p_user_agent?: string
        }
        Returns: {
          access_code_id: string
          document_id: string
          is_full_access: boolean
          user_id: string
        }[]
      }
      get_institution_accessible_patients: {
        Args: { p_institution_email: string }
        Returns: {
          date_autorisation: string
          notes: string
          patient_naissance: string
          patient_nom: string
          patient_prenom: string
        }[]
      }
      get_institution_directives_complete: {
        Args: {
          input_birth_date: string
          input_first_name: string
          input_institution_code: string
          input_last_name: string
        }
        Returns: {
          access_granted: boolean
          directives: Json
          documents: Json
          patient_info: Json
          user_id: string
        }[]
      }
      get_patient_directives_by_institution: {
        Args: {
          input_birth_date: string
          input_first_name: string
          input_institution_code: string
          input_last_name: string
        }
        Returns: {
          created_at: string
          directive_content: Json
          directive_id: string
          patient_info: Json
        }[]
      }
      get_patient_directives_by_institution_access: {
        Args: {
          input_birth_date: string
          input_first_name: string
          input_last_name: string
          input_shared_code: string
        }
        Returns: {
          birth_date: string
          first_name: string
          id: string
          institution_shared_code: string
          last_name: string
        }[]
      }
      get_public_document: {
        Args: { doc_id: string }
        Returns: {
          content_type: string
          created_at: string
          description: string
          external_id: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_shared_documents_by_access_code: {
        Args: {
          input_access_code: string
          input_birth_date?: string
          input_first_name?: string
          input_last_name?: string
        }
        Returns: {
          document_data: Json
          document_id: string
          document_type: string
          shared_at: string
          user_id: string
        }[]
      }
      get_user_access_logs: {
        Args: { p_user_id: string }
        Returns: {
          access_date: string
          access_id: string
          action_type: string
          ip_address: string
          resource_type: string
          user_agent: string
        }[]
      }
      get_user_by_email: { Args: { target_email: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      institution_has_patient_access: {
        Args: {
          p_institution_email: string
          p_patient_naissance: string
          p_patient_nom: string
          p_patient_prenom: string
        }
        Returns: boolean
      }
      institution_has_structure_access: {
        Args: { p_institution_email: string; p_structure_name: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_current_user_admin: { Args: never; Returns: boolean }
      is_user_admin:
        | { Args: { user_id?: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      log_admin_feedback_access: {
        Args: { p_feedback_id: string; p_feedback_user_id: string }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          _details?: Json
          _event_type: string
          _ip_address?: unknown
          _risk_level?: string
          _user_agent?: string
          _user_id?: string
        }
        Returns: undefined
      }
      log_security_event_enhanced:
        | {
            Args: {
              p_details?: Json
              p_event_type: string
              p_ip_address?: unknown
              p_resource_id?: string
              p_resource_type?: string
              p_risk_level?: string
              p_user_agent?: string
              p_user_id?: string
            }
            Returns: string
          }
        | { Args: never; Returns: undefined }
      log_security_event_secure: {
        Args: {
          p_details?: Json
          p_event_type: string
          p_ip_address?: unknown
          p_resource_id?: string
          p_resource_type?: string
          p_risk_level?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
      log_sms_attempt:
        | {
            Args: {
              p_ip_address?: unknown
              p_message_content: string
              p_recipient_phone: string
              p_sender_name: string
              p_user_agent?: string
              p_user_id: string
            }
            Returns: string
          }
        | { Args: never; Returns: undefined }
      secure_document_access: {
        Args: {
          p_access_method: string
          p_document_id: string
          p_ip_address?: unknown
          p_session_id?: string
          p_user_agent?: string
        }
        Returns: {
          access_granted: boolean
          content_type: string
          file_name: string
          file_path: string
          id: string
          user_id: string
        }[]
      }
      send_auth_email_via_brevo: {
        Args: {
          confirmation_url?: string
          email: string
          recovery_url?: string
          type: string
          user_data?: Json
        }
        Returns: undefined
      }
      send_sms_code:
        | { Args: { phone: string }; Returns: undefined }
        | { Args: never; Returns: undefined }
      update_sms_status:
        | {
            Args: {
              p_brevo_message_id?: string
              p_error_message?: string
              p_log_id: string
              p_status: string
            }
            Returns: undefined
          }
        | { Args: never; Returns: undefined }
      validate_and_use_access_code: {
        Args: {
          _access_code: string
          _ip_address?: unknown
          _user_agent?: string
        }
        Returns: {
          document_id: string
          error_message: string
          is_valid: boolean
          user_id: string
        }[]
      }
      validate_directive_access: {
        Args: {
          p_access_code: string
          p_birthdate: string
          p_first_name: string
          p_last_name: string
        }
        Returns: {
          created_at: string
          directive_content: Json
          directive_id: string
        }[]
      }
      validate_secure_document_access:
        | {
            Args: {
              p_access_code?: string
              p_document_id: string
              p_ip_address?: unknown
              p_user_agent?: string
              p_user_id?: string
            }
            Returns: {
              access_granted: boolean
              document_data: Json
              error_message: string
            }[]
          }
        | { Args: never; Returns: undefined }
      validate_session_security:
        | {
            Args: {
              p_browser_fingerprint?: string
              p_ip_address: unknown
              p_user_agent: string
              p_user_id: string
            }
            Returns: boolean
          }
        | { Args: never; Returns: undefined }
      verify_2fa_code: {
        Args: { p_code: string; p_email: string }
        Returns: {
          is_valid: boolean
          user_id: string
        }[]
      }
      verify_access_identity: {
        Args: {
          input_access_code: string
          input_birthdate: string
          input_firstname: string
          input_lastname: string
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
        SetofOptions: {
          from: "*"
          to: "shared_profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      verify_auth_code: {
        Args: { p_code: string; p_target: string }
        Returns: {
          channel: string
          is_valid: boolean
          user_id: string
        }[]
      }
      verify_code: {
        Args: { p_code: string; p_email: string; p_verification_type?: string }
        Returns: {
          is_valid: boolean
          user_id: string
          verification_type: string
        }[]
      }
      verify_directive_access: {
        Args: {
          p_access_code: string
          p_birthdate: string
          p_directive_id: string
          p_name: string
        }
        Returns: {
          directive_content: string
          is_valid: boolean
        }[]
      }
      verify_document_access:
        | {
            Args: {
              p_access_code: string
              p_birth_date: string
              p_first_name: string
              p_last_name: string
            }
            Returns: {
              document_id: string
              is_full_access: boolean
            }[]
          }
        | { Args: never; Returns: undefined }
      verify_institution_access: {
        Args: {
          input_birth_date: string
          input_first_name: string
          input_institution_code: string
          input_last_name: string
        }
        Returns: {
          birth_date: string
          first_name: string
          institution_code_valid: boolean
          last_name: string
          user_id: string
        }[]
      }
      verify_institution_access_with_directives: {
        Args: { p_institution_code: string }
        Returns: {
          created_at: string
          directive_content: Json
          directive_id: string
          pdf_documents: Json
        }[]
      }
      verify_medical_data_access: {
        Args: {
          p_access_code: string
          p_birthdate: string
          p_medical_data_id: string
          p_name: string
        }
        Returns: {
          is_valid: boolean
          medical_data_content: Json
        }[]
      }
      verify_otp: {
        Args: { user_email_input: string; user_otp_input: string }
        Returns: boolean
      }
      verify_patient_access_with_code: {
        Args: {
          p_access_code: string
          p_birth_date: string
          p_first_name: string
          p_last_name: string
        }
        Returns: {
          access_granted: boolean
          patient_id: string
          patient_info: Json
        }[]
      }
      verify_symptom_shared_access: {
        Args: {
          input_access_code: string
          input_birth_date: string
          input_first_name: string
          input_last_name: string
        }
        Returns: {
          access_granted: boolean
          patient_id: string
          patient_info: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
