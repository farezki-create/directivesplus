
export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  content_type?: string;
  user_id: string;
  created_at: string;
  description?: string;
  file_size?: number;
  updated_at?: string;
  external_id?: string;
}

// Type guard pour vérifier si un objet est un Document valide
export const isDocument = (obj: any): obj is Document => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.file_name === 'string' &&
    typeof obj.file_path === 'string' &&
    typeof obj.file_type === 'string' &&
    typeof obj.user_id === 'string' &&
    typeof obj.created_at === 'string';
};

// Type pour les documents partagés
export interface SharedDocument extends Document {
  is_shared?: boolean;
  shared_at?: string;
  access_code?: string;
}
