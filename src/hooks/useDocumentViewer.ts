
import { useCallback } from "react";
import { useDocumentPreview } from "./useDocumentPreview";
import { toast } from "@/hooks/use-toast";
import { viewDocument } from "@/utils/document-operations";
import { detectDocumentType } from "@/components/documents/preview/documentUtils";

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
      
      const { isDirective } = detectDocumentType(filePath);
      
      // For directives, always show in preview mode (they don't have external URLs)
      if (isDirective || fileType === "directive") {
        console.log("useDocumentViewer - Affichage directive en mode preview:", filePath);
        setPreviewDocument(filePath);
        return;
      }
      
      // Set the preview document
      setPreviewDocument(filePath);
      
      // For external viewing, use the viewDocument utility function
      if (fileType !== "preview") {
        viewDocument(filePath);
      }
      
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
