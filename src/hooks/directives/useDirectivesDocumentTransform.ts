
import type { ShareableDocument } from "@/hooks/sharing/types";

export const transformDossierDocuments = (dossierDocuments: any, userId: string): ShareableDocument[] => {
  console.log("=== DEBUG transformDossierDocuments ===");
  console.log("transformDossierDocuments - Début transformation");
  console.log("transformDossierDocuments - Documents reçus:", dossierDocuments);
  console.log("transformDossierDocuments - Type de dossierDocuments:", typeof dossierDocuments);
  console.log("transformDossierDocuments - Est un tableau:", Array.isArray(dossierDocuments));
  console.log("transformDossierDocuments - Longueur:", dossierDocuments?.length);
  console.log("transformDossierDocuments - UserId:", userId);

  // Analyse plus poussée des données reçues
  if (dossierDocuments && typeof dossierDocuments === 'object') {
    console.log("transformDossierDocuments - Constructor:", dossierDocuments.constructor?.name);
    console.log("transformDossierDocuments - Object.prototype.toString:", Object.prototype.toString.call(dossierDocuments));
    
    if (!Array.isArray(dossierDocuments)) {
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
    
    // Gérer différents types de documents
    let transformedDoc: ShareableDocument;
    
    // Si c'est un document directive (a une propriété content et pas de file_path classique)
    if (doc.source === 'directives' || (doc.content && typeof doc.content === 'object' && !doc.file_path?.startsWith('/'))) {
      console.log(`transformDossierDocuments - Document ${index} détecté comme directive:`, doc);
      transformedDoc = {
        id: doc.id || `directive-${index}`,
        file_name: doc.file_name || 'Directive anticipée',
        file_path: `directive://${doc.id}`, // Préfixe spécial pour les directives
        created_at: doc.created_at || new Date().toISOString(),
        user_id: doc.user_id || userId,
        file_type: 'directive' as const,
        source: 'directives' as const,
        description: doc.description || 'Directive anticipée',
        content_type: 'application/json',
        is_private: doc.is_private || false,
        content: doc.content,
        external_id: doc.external_id || null,
        file_size: doc.file_size || null,
        updated_at: doc.updated_at || doc.created_at || new Date().toISOString()
      };
    } 
    // Si c'est un document PDF classique
    else {
      console.log(`transformDossierDocuments - Document ${index} détecté comme PDF:`, doc);
      transformedDoc = {
        id: doc.id || `doc-${index}`,
        file_name: doc.file_name || `Document ${index + 1}`,
        file_path: doc.file_path || '',
        created_at: doc.created_at || new Date().toISOString(),
        user_id: doc.user_id || userId,
        file_type: (doc.file_type || doc.content_type || 'pdf') as 'directive' | 'pdf' | 'medical',
        source: 'pdf_documents' as const,
        description: doc.description || 'Document',
        content_type: doc.content_type || 'application/pdf',
        is_private: doc.is_private || false,
        content: doc.content || null,
        external_id: doc.external_id || null,
        file_size: doc.file_size || null,
        updated_at: doc.updated_at || doc.created_at || new Date().toISOString()
      };
    }
    
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
