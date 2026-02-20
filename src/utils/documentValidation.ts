
import { Document, isDocument } from "@/types/documents";

/**
 * Valide et nettoie un tableau de documents
 */
export const validateDocuments = (documents: any[]): Document[] => {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents
    .filter(doc => isDocument(doc))
    .map(doc => ({
      ...doc,
      file_type: doc.file_type || doc.content_type || 'application/pdf',
      content_type: doc.content_type || doc.file_type || 'application/pdf'
    }));
};

/**
 * Transforme les documents du dossier actif en format Document standard
 */
export const transformDossierDocuments = (dossierDocuments: any[]): Document[] => {
  if (!Array.isArray(dossierDocuments)) {
    return [];
  }

  return dossierDocuments.map((doc: any, index: number): Document => ({
    id: doc.id || `doc-${index}`,
    file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
    file_path: doc.file_path || doc.filePath || '',
    file_type: doc.file_type || doc.fileType || 'application/pdf',
    content_type: doc.content_type || doc.contentType || 'application/pdf',
    user_id: doc.user_id || doc.userId || '',
    created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
    description: doc.description,
    file_size: doc.file_size || doc.fileSize,
    updated_at: doc.updated_at || doc.updatedAt,
    external_id: doc.external_id || doc.externalId
  }));
};
