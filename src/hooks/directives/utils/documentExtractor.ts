
import { Document } from "@/types/documents";
import { transformDossierDocuments, transformDirectiveDocuments, createSingleDocument } from "./documentTransformers";

/**
 * Extracts documents from dossier content
 */
export const extractDocumentsFromDossier = (dossierActif: any): Document[] => {
  console.log("extractDocumentsFromDossier - Chargement des documents...");
  console.log("Dossier actif:", dossierActif);
  
  let foundDocuments: Document[] = [];
  
  if (!dossierActif?.contenu) {
    console.log("Aucun contenu dans le dossier");
    return foundDocuments;
  }

  // Traiter le contenu comme any pour accéder aux propriétés dynamiques
  const contenu = dossierActif.contenu as any;
  console.log("Structure du contenu dossier:", contenu);
  
  // Vérifier s'il y a des documents dans le dossier
  if (contenu.documents && Array.isArray(contenu.documents)) {
    console.log("Documents trouvés dans dossierActif.contenu.documents:", contenu.documents);
    foundDocuments = transformDossierDocuments(contenu.documents, dossierActif.userId);
  }
  
  // Vérifier s'il y a des directives avec documents intégrés
  else if (contenu.directives && Array.isArray(contenu.directives)) {
    console.log("Directives trouvées dans dossierActif.contenu.directives:", contenu.directives);
    foundDocuments = transformDirectiveDocuments(contenu.directives, dossierActif.userId);
  }
  
  // Vérifier d'autres structures possibles (pdf_documents)
  else if (contenu.pdf_documents && Array.isArray(contenu.pdf_documents)) {
    console.log("PDF documents trouvés dans dossierActif.contenu.pdf_documents:", contenu.pdf_documents);
    foundDocuments = transformDossierDocuments(contenu.pdf_documents, dossierActif.userId);
  }
  
  // Cas où le contenu lui-même pourrait être un document
  else if (contenu.file_path || contenu.filePath) {
    console.log("Document unique trouvé dans le contenu principal");
    foundDocuments = [createSingleDocument(contenu, dossierActif.userId)];
  }
  
  console.log("Documents finaux trouvés:", foundDocuments.length, foundDocuments);
  
  if (foundDocuments.length === 0) {
    console.log("Aucun document trouvé - structure du dossier:", JSON.stringify(dossierActif, null, 2));
  }
  
  return foundDocuments;
};
