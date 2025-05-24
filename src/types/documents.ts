
// Types simplifiés pour les documents dans l'application

export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
  user_id: string;
  file_type: string;
  content?: any;
  description?: string;
  content_type?: string;
  external_id?: string;
  file_size?: number;
  updated_at?: string;
}

// Types pour les actions sur les documents
export interface DocumentActions {
  onView: (filePath: string, contentType?: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
}

// Types pour les options d'affichage
export interface DocumentDisplayOptions {
  showPrint?: boolean;
  isAddingToShared?: boolean;
}
