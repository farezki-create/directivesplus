
// Types unifiés pour tous les documents dans l'application
export type { ShareableDocument } from "@/hooks/sharing/types";

// Type alias pour compatibilité avec les anciens composants
export type Document = import("@/hooks/sharing/types").ShareableDocument;

// Types pour les actions sur les documents
export interface DocumentActions {
  onView: (filePath: string, contentType?: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onPrint: (filePath: string, contentType?: string) => void;
  onDelete: (documentId: string) => void;
  onVisibilityChange?: (documentId: string, isPrivate: boolean) => void;
  onAddToSharedFolder?: (document: import("@/hooks/sharing/types").ShareableDocument) => void;
}

// Types pour les options d'affichage
export interface DocumentDisplayOptions {
  showPrint?: boolean;
  showShare?: boolean;
  isAddingToShared?: boolean;
}
