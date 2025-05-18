
import { useCallback } from "react";
import { useDocumentPreview } from "./useDocumentPreview";
import { viewDocument } from "@/utils/document-operations";
import { toast } from "@/hooks/use-toast";

/**
 * Hook that combines document viewing and preview capabilities
 * Solves the circular dependency between useDocumentView and useDocumentPreview
 */
export const useDocumentViewer = () => {
  const { previewDocument, setPreviewDocument } = useDocumentPreview();
  
  const handleView = useCallback((filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("useDocumentViewer - handleView appelé avec:", filePath, fileType);
      
      // Use the viewDocument utility function
      viewDocument(filePath, fileType, setPreviewDocument);
      
      console.log("useDocumentViewer - Document prévisualisé:", filePath);
    } catch (error) {
      console.error("Erreur lors de l'affichage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document",
        variant: "destructive"
      });
    }
  }, [setPreviewDocument]);

  return {
    previewDocument,
    setPreviewDocument,
    handleView
  };
};
