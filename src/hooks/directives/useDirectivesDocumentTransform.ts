
import type { Document } from "@/hooks/useDirectivesDocuments";

export const transformDossierDocuments = (dossierDocuments: any[], userId: string): Document[] => {
  console.log("=== DEBUG transformDossierDocuments ===");
  console.log("transformDossierDocuments - Début transformation");
  console.log("transformDossierDocuments - Documents reçus:", dossierDocuments);
  console.log("transformDossierDocuments - Type de dossierDocuments:", typeof dossierDocuments);
  console.log("transformDossierDocuments - Est un tableau:", Array.isArray(dossierDocuments));
  console.log("transformDossierDocuments - Longueur:", dossierDocuments?.length);
  console.log("transformDossierDocuments - UserId:", userId);

  // Analyse plus poussée des données reçues
  if (dossierDocuments) {
    console.log("transformDossierDocuments - Constructor:", dossierDocuments.constructor.name);
    console.log("transformDossierDocuments - Object.prototype.toString:", Object.prototype.toString.call(dossierDocuments));
    
    if (typeof dossierDocuments === 'object' && !Array.isArray(dossierDocuments)) {
      console.log("transformDossierDocuments - C'est un objet, pas un tableau!");
      console.log("transformDossierDocuments - Clés de l'objet:", Object.keys(dossierDocuments));
      console.log("transformDossierDocuments - Valeurs de l'objet:");
      for (const [key, value] of Object.entries(dossierDocuments)) {
        console.log(`  - ${key}:`, value, `(type: ${typeof value})`);
      }
      
      // Tentative de récupération des documents si c'est un objet avec une propriété documents
      if (dossierDocuments.documents && Array.isArray(dossierDocuments.documents)) {
        console.log("transformDossierDocuments - Trouvé un tableau dans .documents, utilisation de celui-ci");
        return transformDossierDocuments(dossierDocuments.documents, userId);
      }
      
      // Si c'est un objet unique qui ressemble à un document, on le met dans un tableau
      if (dossierDocuments.id || dossierDocuments.file_name || dossierDocuments.content) {
        console.log("transformDossierDocuments - L'objet ressemble à un document unique, conversion en tableau");
        return transformDossierDocuments([dossierDocuments], userId);
      }
    }
  }

  // Vérifier si dossierDocuments est bien un tableau
  if (!Array.isArray(dossierDocuments)) {
    console.error("transformDossierDocuments - ERREUR: dossierDocuments n'est pas un tableau:", dossierDocuments);
    console.log("transformDossierDocuments - Tentative de conversion en tableau...");
    
    // Si c'est une string, essayer de la parser
    if (typeof dossierDocuments === 'string') {
      try {
        const parsed = JSON.parse(dossierDocuments);
        console.log("transformDossierDocuments - String parsée avec succès:", parsed);
        return transformDossierDocuments(parsed, userId);
      } catch (error) {
        console.error("transformDossierDocuments - Impossible de parser la string:", error);
      }
    }
    
    // Si c'est un objet, essayer de l'envelopper dans un tableau
    if (typeof dossierDocuments === 'object' && dossierDocuments !== null) {
      console.log("transformDossierDocuments - Enveloppement de l'objet dans un tableau");
      return transformDossierDocuments([dossierDocuments], userId);
    }
    
    console.log("=== FIN DEBUG transformDossierDocuments (retour tableau vide) ===");
    return [];
  }

  console.log("transformDossierDocuments - Transformation de", dossierDocuments.length, "documents");
  
  const transformedDocs = dossierDocuments.map((doc: any, index: number) => {
    console.log(`transformDossierDocuments - Transformation du document ${index}:`, doc);
    console.log(`transformDossierDocuments - Type du document ${index}:`, typeof doc);
    
    // Éviter les références circulaires en créant une copie propre
    let cleanContent = null;
    if (doc.content && typeof doc.content === 'object') {
      try {
        cleanContent = JSON.parse(JSON.stringify(doc.content));
        console.log(`transformDossierDocuments - Contenu nettoyé du document ${index}:`, cleanContent);
      } catch (error) {
        console.warn(`transformDossierDocuments - Impossible de sérialiser le contenu du document ${index}:`, error);
        cleanContent = { title: doc.content.title || "Contenu indisponible" };
      }
    }
    
    const transformedDoc: Document = {
      id: doc.id || `dossier-doc-${index}`,
      file_name: doc.file_name || doc.title || cleanContent?.title || `Document dossier ${index + 1}`,
      file_path: doc.file_path || (cleanContent ? JSON.stringify(cleanContent) : ''),
      created_at: doc.created_at || new Date().toISOString(),
      description: doc.description || cleanContent?.title || 'Document transféré depuis Directives Doc',
      content_type: doc.content_type || 'application/json',
      user_id: doc.user_id || userId,
      is_private: doc.is_private || false,
      content: cleanContent,
      external_id: doc.external_id || null,
      file_size: doc.file_size || null,
      updated_at: doc.updated_at || doc.created_at || new Date().toISOString()
    };
    
    console.log(`transformDossierDocuments - Document ${index} transformé:`, transformedDoc);
    return transformedDoc;
  });
  
  console.log("transformDossierDocuments - Documents transformés finaux:", transformedDocs);
  console.log("transformDossierDocuments - Type final:", typeof transformedDocs);
  console.log("transformDossierDocuments - Est un tableau final:", Array.isArray(transformedDocs));
  console.log("transformDossierDocuments - Nombre final:", transformedDocs.length);
  console.log("=== FIN DEBUG transformDossierDocuments ===");
  
  return transformedDocs;
};
