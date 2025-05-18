
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
      console.log("useDocumentView - handleView appelé avec:", filePath, fileType);
      
      // This is a simplified version that doesn't handle the preview directly
      // For full functionality, use useDocumentViewer instead
      const setPreviewDocument = (path: string | null) => {
        console.log("Document preview would be set to:", path);
        // This is intentionally empty as this hook is being deprecated
        // in favor of useDocumentViewer
      };
      
      viewDocument(filePath, fileType, setPreviewDocument);
      
      console.log("useDocumentView - Document action triggered:", filePath);
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
