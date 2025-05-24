
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDossierStore } from "@/store/dossierStore";

export const useDirectivesAccessState = () => {
  const { dossierActif } = useDossierStore();
  const [showDocuments, setShowDocuments] = useState(false);

  // Gérer l'ajout de document depuis le dossier partagé
  useEffect(() => {
    const directAccessCode = sessionStorage.getItem('directAccessCode');
    const documentData = sessionStorage.getItem('documentData');
    
    if (directAccessCode && documentData && dossierActif) {
      try {
        const parsedDocuments = JSON.parse(documentData);
        console.log("Document ajouté depuis le dossier partagé:", parsedDocuments);
        
        // Nettoyer le sessionStorage
        sessionStorage.removeItem('directAccessCode');
        sessionStorage.removeItem('documentData');
        
        // Afficher un toast de confirmation
        toast({
          title: "Document ajouté avec succès",
          description: "Le document a été ajouté à vos directives et est maintenant accessible",
        });
      } catch (error) {
        console.error("Erreur lors du traitement du document ajouté:", error);
      }
    }
  }, [dossierActif]);

  return {
    showDocuments,
    setShowDocuments
  };
};
