
import { Document } from "@/types/documents";

/**
 * Transforms documents from dossier content to Document format
 */
export const transformDossierDocuments = (documents: any[], userId: string): Document[] => {
  return documents.map((doc: any, index: number): Document => ({
    id: doc.id || `doc-${index}`,
    file_name: doc.file_name || doc.fileName || `Document ${index + 1}`,
    file_path: doc.file_path || doc.filePath || '',
    file_type: doc.file_type || doc.fileType || doc.content_type || 'application/pdf',
    content_type: doc.content_type || doc.contentType || 'application/pdf',
    user_id: doc.user_id || doc.userId || userId || '',
    created_at: doc.created_at || doc.createdAt || new Date().toISOString(),
    description: doc.description,
    file_size: doc.file_size || doc.fileSize,
    updated_at: doc.updated_at || doc.updatedAt,
    external_id: doc.external_id || doc.externalId
  }));
};

/**
 * Transforms directive items to documents
 */
export const transformDirectiveDocuments = (directives: any[], userId: string): Document[] => {
  return directives
    .filter((item: any) => item.type === 'document' || item.file_path || item.filePath)
    .map((item: any, index: number): Document => ({
      id: item.id || `directive-doc-${index}`,
      file_name: item.file_name || item.fileName || `Document directive ${index + 1}`,
      file_path: item.file_path || item.filePath || '',
      file_type: item.file_type || item.fileType || item.content_type || 'application/pdf',
      content_type: item.content_type || item.contentType || 'application/pdf',
      user_id: item.user_id || item.userId || userId || '',
      created_at: item.created_at || item.createdAt || new Date().toISOString(),
      description: item.description,
      file_size: item.file_size || item.fileSize,
      updated_at: item.updated_at || item.updatedAt,
      external_id: item.external_id || item.externalId
    }));
};

/**
 * Creates a single document from content
 */
export const createSingleDocument = (contenu: any, userId: string): Document => {
  return {
    id: contenu.id || 'main-doc',
    file_name: contenu.file_name || contenu.fileName || 'Document principal',
    file_path: contenu.file_path || contenu.filePath,
    file_type: contenu.file_type || contenu.fileType || 'application/pdf',
    content_type: contenu.content_type || contenu.contentType || 'application/pdf',
    user_id: userId || '',
    created_at: contenu.created_at || contenu.createdAt || new Date().toISOString(),
    description: contenu.description,
    file_size: contenu.file_size || contenu.fileSize,
    updated_at: contenu.updated_at || contenu.updatedAt,
    external_id: contenu.external_id || contenu.externalId
  };
};
