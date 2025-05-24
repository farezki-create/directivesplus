
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { shareDocument } from "@/utils/document-operations.ts";

export const useDocumentShare = () => {
  const handleShare = useCallback((documentId: string) => {
    try {
      console.log("useDocumentShare - handleShare appelé pour:", documentId);
      
      // Use the shareDocument utility function
      shareDocument(documentId);
      
      console.log("useDocumentShare - Document partagé:", documentId);
    } catch (error) {
      console.error("Erreur lors du partage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de partager le document",
        variant: "destructive"
      });
    }
  }, []);

  return { handleShare };
};
