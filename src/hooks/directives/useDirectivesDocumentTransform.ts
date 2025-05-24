
import type { Document } from "@/hooks/useDirectivesDocuments";

export const transformDossierDocuments = (dossierDocuments: any[], userId: string): Document[] => {
  console.log("transformDossierDocuments - Début transformation");
  console.log("transformDossierDocuments - Documents reçus:", dossierDocuments);
  console.log("transformDossierDocuments - Type de dossierDocuments:", typeof dossierDocuments);
  console.log("transformDossierDocuments - Est un tableau:", Array.isArray(dossierDocuments));
  console.log("transformDossierDocuments - Longueur:", dossierDocuments?.length);
  console.log("transformDossierDocuments - UserId:", userId);

  // Vérifier si dossierDocuments est bien un tableau
  if (!Array.isArray(dossierDocuments)) {
    console.error("transformDossierDocuments - ERREUR: dossierDocuments n'est pas un tableau:", dossierDocuments);
    return [];
  }

  return dossierDocuments.map((doc: any, index: number) => {
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
};
