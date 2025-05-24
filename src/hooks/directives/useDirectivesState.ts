
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";
import { Document } from "@/types/documents";

export const useDirectivesState = () => {
  const { clearDossierActif, dossierActif } = useDossierStore();
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [showAddOptionsPublic, setShowAddOptionsPublic] = useState(false);
  
  // Clear any existing dossier data on component mount to force fresh access
  useEffect(() => {
    clearDossierActif();
  }, [clearDossierActif]);
  
  // Handle document added toast
  useEffect(() => {
    const documentAdded = sessionStorage.getItem('documentAdded');
    
    if (documentAdded && dossierActif) {
      try {
        const addedDocInfo = JSON.parse(documentAdded);
        console.log("Document détecté comme ajouté:", addedDocInfo);
        
        // Clean sessionStorage
        sessionStorage.removeItem('documentAdded');
        
        // Show confirmation toast
        toast({
          title: "Document ajouté avec succès",
          description: `${addedDocInfo.fileName} est maintenant accessible dans vos directives`,
        });
      } catch (error) {
        console.error("Erreur lors du traitement du document ajouté:", error);
      }
    }
  }, [dossierActif]);

  return {
    previewDocument,
    setPreviewDocument,
    showAddOptionsPublic,
    setShowAddOptionsPublic
  };
};
