
import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";
import { viewDocument } from "@/utils/documentOperations";

export const useDocumentView = () => {
  const { setPreviewDocument } = useDocumentPreview();

  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("Demande de visualisation du document:", filePath, fileType);
      
      if (!filePath) {
        console.error("Tentative de visualisation avec un chemin vide");
        toast({
          title: "Erreur",
          description: "Impossible d'afficher le document: chemin invalide",
          variant: "destructive"
        });
        return;
      }

      viewDocument(filePath, fileType, setPreviewDocument);
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

