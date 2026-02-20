
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { viewDocument } from "@/utils/document-operations";

/**
 * Simple hook for document viewing operations
 * @deprecated Use useDocumentViewer instead
 */
export const useDocumentView = () => {
  const handleView = useCallback((filePath: string, fileType: string = "application/pdf") => {
    try {
      viewDocument(filePath);
    } catch (error) {
      console.error("Erreur lors de l'affichage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document",
        variant: "destructive"
      });
    }
  }, []);

  return { handleView };
};
