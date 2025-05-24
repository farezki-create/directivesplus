
import { useMemo } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { transformDossierDocuments } from "./useDirectivesDocumentTransform";
import type { Document } from "@/hooks/useDirectivesDocuments";

export const useDossierDocuments = () => {
  const { dossierActif } = useDossierStore();

  const getDossierDocuments = useMemo((): Document[] => {
    console.log("=== DEBUG useDossierDocuments - getDossierDocuments (memoized) ===");
    
    if (!dossierActif?.contenu?.documents) {
      console.log("useDossierDocuments - Aucun document dans le dossier actif, retour tableau vide");
      return [];
    }

    console.log("useDossierDocuments - Transformation des documents du dossier...");
    const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
    console.log("useDossierDocuments - Documents transformés:", dossierDocuments?.length);
    return dossierDocuments;
  }, [dossierActif?.contenu?.documents, dossierActif?.userId]);

  const mergeDocuments = useMemo(() => {
    return (supabaseDocuments: Document[]): Document[] => {
      console.log("=== DEBUG useDossierDocuments - mergeDocuments (memoized) ===");
      
      // Créer un Set des IDs Supabase pour éviter les doublons
      const supabaseIds = new Set(supabaseDocuments.map(doc => doc.id));
      
      // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
      let allDocuments = [...supabaseDocuments];
      
      if (dossierActif?.contenu?.documents) {
        console.log("useDossierDocuments - Fusion avec les documents du dossier actif");
        
        // Filtrer les doublons - ne garder que les documents du dossier qui ne sont pas déjà dans Supabase
        const uniqueDossierDocs = getDossierDocuments.filter(doc => !supabaseIds.has(doc.id));
        console.log("useDossierDocuments - Documents uniques du dossier:", uniqueDossierDocs?.length);
        allDocuments = [...allDocuments, ...uniqueDossierDocs];
      }
      
      console.log("useDossierDocuments - Tous les documents fusionnés:", allDocuments?.length);
      return allDocuments;
    };
  }, [getDossierDocuments, dossierActif?.contenu?.documents]);

  return {
    getDossierDocuments,
    mergeDocuments,
    dossierActif
  };
};
