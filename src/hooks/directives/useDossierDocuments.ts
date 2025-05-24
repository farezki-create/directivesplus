
import { useDossierStore } from "@/store/dossierStore";
import { transformDossierDocuments } from "./useDirectivesDocumentTransform";
import type { Document } from "@/hooks/useDirectivesDocuments";

export const useDossierDocuments = () => {
  const { dossierActif } = useDossierStore();

  const getDossierDocuments = (): Document[] => {
    console.log("useDossierDocuments - getDossierDocuments appelé");
    console.log("useDossierDocuments - dossierActif:", dossierActif);
    console.log("useDossierDocuments - dossierActif?.contenu:", dossierActif?.contenu);
    console.log("useDossierDocuments - dossierActif?.contenu?.documents:", dossierActif?.contenu?.documents);
    console.log("useDossierDocuments - Type de documents:", typeof dossierActif?.contenu?.documents);
    console.log("useDossierDocuments - Est un tableau:", Array.isArray(dossierActif?.contenu?.documents));
    
    if (dossierActif?.contenu?.documents) {
      console.log("useDossierDocuments - Transformation des documents du dossier...");
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      console.log("useDossierDocuments - Documents transformés:", dossierDocuments);
      console.log("useDossierDocuments - Nombre de documents transformés:", dossierDocuments.length);
      return dossierDocuments;
    } else {
      console.log("useDossierDocuments - Aucun document dans le dossier actif, retour tableau vide");
      return [];
    }
  };

  const mergeDocuments = (supabaseDocuments: Document[]): Document[] => {
    console.log("useDossierDocuments - mergeDocuments appelé");
    console.log("useDossierDocuments - Documents Supabase:", supabaseDocuments);
    
    // Créer un Set des IDs Supabase pour éviter les doublons
    const supabaseIds = new Set(supabaseDocuments.map(doc => doc.id));
    
    // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
    let allDocuments = [...supabaseDocuments];
    
    if (dossierActif?.contenu?.documents) {
      console.log("useDossierDocuments - Fusion avec les documents du dossier actif");
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      // Filtrer les doublons - ne garder que les documents du dossier qui ne sont pas déjà dans Supabase
      const uniqueDossierDocs = dossierDocuments.filter(doc => !supabaseIds.has(doc.id));
      console.log("useDossierDocuments - Documents uniques du dossier:", uniqueDossierDocs);
      allDocuments = [...allDocuments, ...uniqueDossierDocs];
    }
    
    console.log("useDossierDocuments - Tous les documents fusionnés:", allDocuments);
    console.log("useDossierDocuments - Nombre total de documents:", allDocuments.length);
    return allDocuments;
  };

  return {
    getDossierDocuments,
    mergeDocuments,
    dossierActif
  };
};
