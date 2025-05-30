
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDirectivesStore } from "@/store/directivesStore";

export const useDirectivesAccessState = () => {
  const { documents, addDocument } = useDirectivesStore();
  const [showDocuments, setShowDocuments] = useState(false);

  useEffect(() => {
    const directAccessCode = sessionStorage.getItem('directAccessCode');
    const documentData = sessionStorage.getItem('documentData');
    
    if (directAccessCode && documentData && documents.length > 0) {
      try {
        const parsedDocuments = JSON.parse(documentData);
        console.log("Document ajouté depuis le dossier partagé:", parsedDocuments);
        
        addDocument(parsedDocuments);
        
        sessionStorage.removeItem('directAccessCode');
        sessionStorage.removeItem('documentData');
        
        toast({
          title: "Document ajouté avec succès",
          description: "Le document a été ajouté à vos directives et est maintenant accessible",
        });
      } catch (error) {
        console.error("Erreur lors du traitement du document ajouté:", error);
      }
    }
  }, [documents, addDocument]);

  return {
    showDocuments,
    setShowDocuments
  };
};
