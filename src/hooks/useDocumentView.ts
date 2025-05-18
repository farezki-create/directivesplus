
import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";
import { viewDocument } from "@/utils/document-operations";

export const useDocumentView = () => {
  const { setPreviewDocument } = useDocumentPreview();

  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("useDocumentView - handleView appelé avec:", filePath, fileType);
      
      // Use the viewDocument utility function
      viewDocument(filePath, fileType, setPreviewDocument);
      
      console.log("useDocumentView - Document prévisualisé:", filePath);
    } catch (error) {
      console.error("Erreur lors de l'affichage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document",
        variant: "destructive"
      });
    }
  };

  return { handleView };
};
