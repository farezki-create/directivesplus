
import type { Document } from "@/hooks/useDirectivesDocuments";

export const transformDossierDocuments = (dossierDocuments: any[], userId: string): Document[] => {
  return dossierDocuments.map((doc: any) => {
    console.log("Transformation du document dossier:", doc);
    
    // Éviter les références circulaires en créant une copie propre
    let cleanContent = null;
    if (doc.content && typeof doc.content === 'object') {
      try {
        cleanContent = JSON.parse(JSON.stringify(doc.content));
      } catch (error) {
        console.warn("Impossible de sérialiser le contenu:", error);
        cleanContent = { title: doc.content.title || "Contenu indisponible" };
      }
    }
    
    const transformedDoc: Document = {
      id: doc.id,
      file_name: doc.file_name || doc.title || cleanContent?.title || 'Document transféré',
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
    
    console.log("Document transformé:", transformedDoc);
    return transformedDoc;
  });
};
