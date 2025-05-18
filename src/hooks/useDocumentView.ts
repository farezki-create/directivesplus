
import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";

export const useDocumentView = () => {
  const { setPreviewDocument } = useDocumentPreview();

  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("useDocumentView - handleView appelé avec:", filePath, fileType);
      // Simplifier le flux - afficher directement le document
      setPreviewDocument(filePath);
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
