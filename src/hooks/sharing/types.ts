
// Types unifiés pour le système de partage
export interface ShareableDocument {
  id: string;
  file_name: string;
  file_path: string; // Obligatoire pour compatibilité
  created_at: string;
  user_id: string;
  file_type: 'directive' | 'pdf' | 'medical';
  source: 'directives' | 'pdf_documents' | 'medical_documents';
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
  accessType?: 'personal' | 'institution';
}

export interface SharingResult {
  success: boolean;
  code?: string;
  error?: string;
}

export interface AccessValidationResult {
  success: boolean;
  documents?: ShareableDocument[];
  error?: string;
  message?: string;
  patientData?: {
    user_id: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  };
}

// Alias pour compatibilité avec AccessCodeValidationResult
export type AccessCodeValidationResult = AccessValidationResult;

export interface SharedDocument {
  id: string;
  access_code: string;
  document_id: string;
  document_type: string;
  document_data: any;
  user_id: string;
  shared_at: string;
  expires_at?: string;
  is_active: boolean;
}
