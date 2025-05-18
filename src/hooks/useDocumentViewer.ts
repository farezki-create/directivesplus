
import { useCallback } from "react";
import { useDocumentPreview } from "./useDocumentPreview";
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
      
      if (!filePath) {
        throw new Error("Chemin de fichier invalide");
      }
      
      // Directement définir le document à prévisualiser
      setPreviewDocument(filePath);
      
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
