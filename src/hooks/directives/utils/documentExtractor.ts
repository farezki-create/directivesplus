
import { Document } from "@/types/documents";
import { transformDossierDocuments, transformDirectiveDocuments, createSingleDocument } from "./documentTransformers";

/**
 * Extracts documents from dossier content
 */
export const extractDocumentsFromDossier = (dossierActif: any): Document[] => {
  let foundDocuments: Document[] = [];
  
  if (!dossierActif?.contenu) return foundDocuments;

  const contenu = dossierActif.contenu as any;
  
  if (contenu.documents && Array.isArray(contenu.documents)) {
    foundDocuments = transformDossierDocuments(contenu.documents, dossierActif.userId);
  } else if (contenu.directives && Array.isArray(contenu.directives)) {
    foundDocuments = transformDirectiveDocuments(contenu.directives, dossierActif.userId);
  } else if (contenu.pdf_documents && Array.isArray(contenu.pdf_documents)) {
    foundDocuments = transformDossierDocuments(contenu.pdf_documents, dossierActif.userId);
  } else if (contenu.file_path || contenu.filePath) {
    foundDocuments = [createSingleDocument(contenu, dossierActif.userId)];
  }
  
  return foundDocuments;
};
