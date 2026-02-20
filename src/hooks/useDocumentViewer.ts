
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
      if (!filePath) {
        throw new Error("Chemin de fichier invalide");
      }
      
      const { isDirective } = detectDocumentType(filePath);
      
      // Pour les directives et la prévisualisation, on affiche seulement dans la modal
      if (isDirective || fileType === "directive" || fileType === "preview") {
        setPreviewDocument(filePath);
        return;
      }
      
      // Set the preview document pour tous les cas
      setPreviewDocument(filePath);
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
