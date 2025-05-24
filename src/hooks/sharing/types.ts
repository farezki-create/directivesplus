
export interface ShareableDocument {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  description?: string;
  content_type?: string;
  file_type?: string;
  user_id?: string;
  is_private?: boolean;
  content?: any;
  external_id?: string | null;
  file_size?: number | null;
  updated_at?: string;
  source?: 'pdf_documents' | 'directives' | 'medical_documents';
}

export interface ShareOptions {
  expiresInDays?: number;
  accessType?: 'public' | 'institution' | 'medical';
  allowedAccesses?: number;
}

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
