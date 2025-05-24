
/**
 * Types unifiés pour le système de codes d'accès
 */

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface AccessCodeOptions {
  expiresInDays?: number;
  accessType?: 'global' | 'institution' | 'personal';
  description?: string;
  requirePersonalInfo?: boolean;
}

export interface AccessValidationResult {
  success: boolean;
  documents?: ShareableDocument[];
  message?: string;
  error?: string;
  userId?: string;
  accessType?: string;
}

export interface CodeGenerationResult {
  success: boolean;
  code?: string;
  message?: string;
  error?: string;
  expiresAt?: string;
}

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

export interface DocumentBundle {
  userId: string;
  accessType: string;
  totalDocuments: number;
  generatedAt: string;
  documents: ShareableDocument[];
}
