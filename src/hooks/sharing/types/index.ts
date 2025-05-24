
export interface ShareableDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  user_id: string;
  file_type: string;
  source: string;
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
  accessType?: 'public' | 'institution' | 'personal';
  isFullAccess?: boolean;
}

export interface SharedDocument {
  id: string;
  user_id: string;
  document_id: string;
  document_type: string;
  document_data: any;
  access_code: string;
  shared_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface AccessCodeValidationResult {
  success: boolean;
  message: string;
  documents?: ShareableDocument[];
  patientData?: {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
  };
}

export interface CodeGenerationOptions {
  type: 'personal' | 'institution' | 'medical';
  expiresInDays: number;
  documentId: string;
  userId: string;
}
