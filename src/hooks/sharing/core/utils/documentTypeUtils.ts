
import type { ShareableDocument } from "@/types/sharing";

/**
 * Détermine le type de document pour la contrainte DB
 */
export const determineDocumentType = (document: ShareableDocument): string => {
  // Vérifier explicitement que c'est une directive
  if (document.source === 'directives' || document.file_type === 'directive') {
    return 'directives';
  }
  // Par défaut, considérer comme PDF
  return 'pdf_documents';
};
