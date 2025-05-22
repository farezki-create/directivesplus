
import { useState, useEffect } from "react";
import { useDossierStore } from "@/store/dossierStore";

export const useDocumentProcessing = (
  dossierActif: any,
  decryptedContent: any,
  loading: boolean,
  hasDirectives: boolean,
  setDossierActif: (dossier: any) => void,
  logDossierEvent: (event: string, success: boolean) => void
) => {
  const [documentLoadError, setDocumentLoadError] = useState<string | null>(null);

  // Check for stored document data in sessionStorage
  useEffect(() => {
    try {
      const storedDocumentData = sessionStorage.getItem('documentData');
      if (storedDocumentData && dossierActif) {
        console.log("Documents trouvés dans sessionStorage:", storedDocumentData);
        const documents = JSON.parse(storedDocumentData);
        
        // Update the dossier to include the documents list
        if (!dossierActif.contenu.documents) {
          const updatedDossier = {
            ...dossierActif,
            contenu: {
              ...dossierActif.contenu,
              documents: documents
            }
          };
          
          console.log("Mise à jour du dossier avec les documents:", updatedDossier);
          setDossierActif(updatedDossier);
          
          // Clear the sessionStorage after use
          sessionStorage.removeItem('documentData');
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des documents dans sessionStorage:", error);
    }
  }, [dossierActif, setDossierActif]);
  
  // Log detailed information about the dossier state for debugging
  useEffect(() => {
    if (dossierActif) {
      console.log("AffichageDossier - dossierActif état:", { 
        id: dossierActif.id,
        hasDocumentUrl: !!dossierActif.contenu?.document_url,
        documentUrl: dossierActif.contenu?.document_url,
        hasDocuments: !!dossierActif.contenu?.documents,
        documents: dossierActif.contenu?.documents,
        decryptedContentAvailable: !!decryptedContent,
        loading
      });
    } else {
      console.log("AffichageDossier - Aucun dossier actif");
    }
  }, [dossierActif, decryptedContent, loading]);
  
  // Check for document-related errors when the dossier content changes
  useEffect(() => {
    if (dossierActif && !loading) {
      // Verify if we have document URL or documents list
      const hasDocumentUrl = !!dossierActif.contenu?.document_url;
      const hasDocumentsList = !!dossierActif.contenu?.documents && 
        Array.isArray(dossierActif.contenu.documents) && 
        dossierActif.contenu.documents.length > 0;
      
      if (hasDocumentUrl || hasDocumentsList) {
        console.log("Documents trouvés dans le dossier:", {
          url: dossierActif.contenu?.document_url,
          documents: dossierActif.contenu?.documents
        });
        
        // If we have decrypted content, make sure it includes the document information
        if (decryptedContent) {
          let updatedContent = { ...decryptedContent };
          let needsUpdate = false;
          
          if (hasDocumentUrl && !updatedContent.document_url) {
            updatedContent.document_url = dossierActif.contenu.document_url;
            needsUpdate = true;
          }
          
          if (hasDocumentsList && !updatedContent.documents) {
            updatedContent.documents = dossierActif.contenu.documents;
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            // Force update of dossier actif to ensure document information is present
            setDossierActif({
              ...dossierActif,
              contenu: {
                ...dossierActif.contenu,
                ...(hasDocumentUrl ? { document_url: dossierActif.contenu.document_url } : {}),
                ...(hasDocumentsList ? { documents: dossierActif.contenu.documents } : {})
              }
            });
            
            console.log("Mise à jour du contenu déchiffré avec les documents:", updatedContent);
          }
        }
        
        setDocumentLoadError(null);
      } else if (!hasDirectives) {
        console.log("Aucune URL de document, liste de documents ou directive trouvée dans le dossier");
        setDocumentLoadError("Le document n'a pas pu être chargé correctement. Veuillez réessayer.");
        logDossierEvent("document_load_failure", false);
      } else {
        setDocumentLoadError(null);
      }
    }
  }, [dossierActif, decryptedContent, loading, hasDirectives, setDossierActif, logDossierEvent]);

  return { documentLoadError };
};
