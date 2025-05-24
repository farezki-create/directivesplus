
/**
 * Types unifiés pour le système de partage - Version refactorisée
 */

export type DocumentSource = 'pdf_documents' | 'directives' | 'medical_documents';
export type DocumentType = 'directive' | 'pdf' | 'medical';
export type AccessType = 'personal' | 'institution' | 'public';

export interface ShareableDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  user_id: string;
  file_type: DocumentType;
  source: DocumentSource;
  content?: any;
  description?: string;
  content_type?: string;
  is_private?: boolean;
  external_id?: string;
  file_size?: number;
  updated_at?: string;
}

// Structure stricte pour les données globales dans Supabase
export interface GlobalAccessData {
  access_type: 'global';
  user_id: string;
  total_documents: number;
  generated_at: string;
  documents: ShareableDocument[];
}

// Structure pour les réponses de la RPC Supabase
export interface SupabaseSharedDocumentResponse {
  document_id: string;
  document_type: string;
  document_data: GlobalAccessData;
  user_id: string;
  shared_at: string;
}

export interface ShareOptions {
  expiresInDays?: number;
  accessType?: AccessType;
  requirePersonalInfo?: boolean;
}

export interface SharingResult {
  success: boolean;
  code?: string;
  error?: string;
}

export interface AccessValidationResult {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}

export interface SharedDocument {
  id: string;
  user_id: string;
  document_id: string;
  document_type: string;
  document_data: GlobalAccessData;
  access_code: string;
  expires_at: string | null;
  shared_at: string;
  is_active: boolean;
}

// Types pour les services
export interface AccessCodeOptions {
  expiresInDays?: number;
  accessType?: 'personal' | 'institution';
}

export interface AccessCodeResult {
  success: boolean;
  code?: string;
  error?: string;
}

export interface ValidationRequest {
  accessCode: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
  };
}

export interface ValidationResult {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
}
