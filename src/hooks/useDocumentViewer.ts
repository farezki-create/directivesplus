
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
      
      // Pour les directives et la prévisualisation, on affiche seulement dans la modal
      if (isDirective || fileType === "directive" || fileType === "preview") {
        console.log("useDocumentViewer - Affichage en mode preview uniquement:", filePath);
        setPreviewDocument(filePath);
        return;
      }
      
      // Set the preview document pour tous les cas
      setPreviewDocument(filePath);
      
      // Pour les autres types de documents, on peut aussi ouvrir en externe si demandé explicitement
      // Mais par défaut, on reste sur la prévisualisation uniquement
      
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
