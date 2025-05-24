
import { useDossierStore } from "@/store/dossierStore";
import { transformDossierDocuments } from "./useDirectivesDocumentTransform";
import type { Document } from "@/hooks/useDirectivesDocuments";

export const useDossierDocuments = () => {
  const { dossierActif } = useDossierStore();

  const getDossierDocuments = (): Document[] => {
    console.log("=== DEBUG useDossierDocuments - getDossierDocuments ===");
    console.log("useDossierDocuments - getDossierDocuments appelé");
    console.log("useDossierDocuments - dossierActif:", dossierActif);
    console.log("useDossierDocuments - dossierActif?.contenu:", dossierActif?.contenu);
    console.log("useDossierDocuments - dossierActif?.contenu?.documents:", dossierActif?.contenu?.documents);
    console.log("useDossierDocuments - Type de documents:", typeof dossierActif?.contenu?.documents);
    console.log("useDossierDocuments - Est un tableau:", Array.isArray(dossierActif?.contenu?.documents));
    
    // Analyse plus détaillée des données
    if (dossierActif?.contenu?.documents) {
      console.log("useDossierDocuments - Structure complète des documents:");
      try {
        console.log(JSON.stringify(dossierActif.contenu.documents, null, 2));
      } catch (error) {
        console.log("useDossierDocuments - Impossible de sérialiser documents:", error);
        console.log("useDossierDocuments - Documents (inspection directe):", dossierActif.contenu.documents);
      }
      
      // Si ce n'est pas un tableau, analysons ce que c'est
      if (!Array.isArray(dossierActif.contenu.documents)) {
        console.log("useDossierDocuments - ATTENTION: documents n'est pas un tableau!");
        console.log("useDossierDocuments - Type détaillé:", Object.prototype.toString.call(dossierActif.contenu.documents));
        
        // Vérification de l'existence de constructor de manière sécurisée
        const documentsData = dossierActif.contenu.documents as any;
        if (documentsData && typeof documentsData === 'object' && documentsData.constructor) {
          console.log("useDossierDocuments - Constructor:", documentsData.constructor.name);
        }
        
        console.log("useDossierDocuments - Clés de l'objet:", Object.keys(dossierActif.contenu.documents));
        
        // Essayer de trouver des propriétés qui pourraient être des documents
        for (const [key, value] of Object.entries(dossierActif.contenu.documents)) {
          console.log(`useDossierDocuments - Propriété "${key}":`, value);
          console.log(`useDossierDocuments - Type de "${key}":`, typeof value);
          console.log(`useDossierDocuments - Est un tableau "${key}":`, Array.isArray(value));
        }
      }
      
      console.log("useDossierDocuments - Transformation des documents du dossier...");
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      console.log("useDossierDocuments - Documents transformés:", dossierDocuments);
      console.log("useDossierDocuments - Type des documents transformés:", typeof dossierDocuments);
      console.log("useDossierDocuments - Est un tableau transformé:", Array.isArray(dossierDocuments));
      console.log("useDossierDocuments - Nombre de documents transformés:", dossierDocuments?.length);
      console.log("=== FIN DEBUG useDossierDocuments ===");
      return dossierDocuments;
    } else {
      console.log("useDossierDocuments - Aucun document dans le dossier actif, retour tableau vide");
      console.log("=== FIN DEBUG useDossierDocuments ===");
      return [];
    }
  };

  const mergeDocuments = (supabaseDocuments: Document[]): Document[] => {
    console.log("=== DEBUG useDossierDocuments - mergeDocuments ===");
    console.log("useDossierDocuments - mergeDocuments appelé");
    console.log("useDossierDocuments - Documents Supabase:", supabaseDocuments);
    console.log("useDossierDocuments - Type Supabase documents:", typeof supabaseDocuments);
    console.log("useDossierDocuments - Est un tableau Supabase:", Array.isArray(supabaseDocuments));
    
    // Créer un Set des IDs Supabase pour éviter les doublons
    const supabaseIds = new Set(supabaseDocuments.map(doc => doc.id));
    
    // Combiner les documents Supabase avec ceux du dossier actif s'il y en a
    let allDocuments = [...supabaseDocuments];
    
    if (dossierActif?.contenu?.documents) {
      console.log("useDossierDocuments - Fusion avec les documents du dossier actif");
      const dossierDocuments = transformDossierDocuments(dossierActif.contenu.documents, dossierActif.userId);
      console.log("useDossierDocuments - Documents dossier après transformation:", dossierDocuments);
      console.log("useDossierDocuments - Type documents dossier:", typeof dossierDocuments);
      console.log("useDossierDocuments - Est un tableau dossier:", Array.isArray(dossierDocuments));
      
      // Filtrer les doublons - ne garder que les documents du dossier qui ne sont pas déjà dans Supabase
      const uniqueDossierDocs = dossierDocuments.filter(doc => !supabaseIds.has(doc.id));
      console.log("useDossierDocuments - Documents uniques du dossier:", uniqueDossierDocs);
      allDocuments = [...allDocuments, ...uniqueDossierDocs];
    }
    
    console.log("useDossierDocuments - Tous les documents fusionnés:", allDocuments);
    console.log("useDossierDocuments - Type documents fusionnés:", typeof allDocuments);
    console.log("useDossierDocuments - Est un tableau fusionné:", Array.isArray(allDocuments));
    console.log("useDossierDocuments - Nombre total de documents:", allDocuments?.length);
    console.log("=== FIN DEBUG mergeDocuments ===");
    return allDocuments;
  };

  return {
    getDossierDocuments,
    mergeDocuments,
    dossierActif
  };
};
