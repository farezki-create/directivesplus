
/**
 * Types unifiés pour le système de partage
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
  document_data: any;
  access_code: string;
  expires_at: string | null;
  shared_at: string;
  is_active: boolean;
}
