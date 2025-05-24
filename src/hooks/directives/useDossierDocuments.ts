
import { useMemo } from "react";
import { useDossierStore } from "@/store/dossierStore";
import { transformDossierDocuments } from "./useDirectivesDocumentTransform";
import type { Document } from "@/hooks/useDirectivesDocuments";

export const useDossierDocuments = () => {
  const { dossierActif } = useDossierStore();

  // Memoize les documents du dossier pour éviter les recalculs
  const dossierDocuments = useMemo(() => {
    if (dossierActif?.contenu?.documents) {
      return transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
    }
    return [];
  }, [dossierActif?.contenu?.documents, dossierActif?.userId]);

  const getDossierDocuments = (): Document[] => {
    console.log("Loading documents from dossier actif (memoized)");
    return dossierDocuments;
  };

  const mergeDocuments = useMemo(() => {
    return (supabaseDocuments: Document[]): Document[] => {
      // Créer un Set des IDs Supabase pour éviter les doublons
      const supabaseIds = new Set(supabaseDocuments.map(doc => doc.id));
      
      // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
      let allDocuments = [...supabaseDocuments];
      
      if (dossierDocuments.length > 0) {
        // Filtrer les doublons - ne garder que les documents du dossier qui ne sont pas déjà dans Supabase
        const uniqueDossierDocs = dossierDocuments.filter(doc => !supabaseIds.has(doc.id));
        allDocuments = [...allDocuments, ...uniqueDossierDocs];
      }
      
      return allDocuments;
    };
  }, [dossierDocuments]);

  return {
    getDossierDocuments,
    mergeDocuments,
    dossierActif
  };
};
