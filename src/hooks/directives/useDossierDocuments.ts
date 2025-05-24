
import { useDossierStore } from "@/store/dossierStore";
import { transformDossierDocuments } from "./useDirectivesDocumentTransform";
import type { Document } from "@/hooks/useDirectivesDocuments";

export const useDossierDocuments = () => {
  const { dossierActif } = useDossierStore();

  const getDossierDocuments = (): Document[] => {
    console.log("Loading documents from dossier actif:", dossierActif);
    
    if (dossierActif?.contenu?.documents) {
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      console.log("Documents loaded from dossier:", dossierDocuments);
      return dossierDocuments;
    } else {
      console.log("No documents in dossier actif");
      return [];
    }
  };

  const mergeDocuments = (supabaseDocuments: Document[]): Document[] => {
    // Créer un Set des IDs Supabase pour éviter les doublons
    const supabaseIds = new Set(supabaseDocuments.map(doc => doc.id));
    
    // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
    let allDocuments = [...supabaseDocuments];
    
    if (dossierActif?.contenu?.documents) {
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      // Filtrer les doublons - ne garder que les documents du dossier qui ne sont pas déjà dans Supabase
      const uniqueDossierDocs = dossierDocuments.filter(doc => !supabaseIds.has(doc.id));
      allDocuments = [...allDocuments, ...uniqueDossierDocs];
    }
    
    console.log("useDossierDocuments - Tous les documents (Supabase + Dossier uniquement):", allDocuments);
    return allDocuments;
  };

  return {
    getDossierDocuments,
    mergeDocuments,
    dossierActif
  };
};
