
import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";

export const useDocumentView = () => {
  const { setPreviewDocument } = useDocumentPreview();

  const handleView = (filePath: string, fileType: string = "application/pdf") => {
    try {
      console.log("[useDocumentView] Demande de visualisation du document:", filePath);
      
      if (!filePath) {
        console.error("[useDocumentView] Tentative de visualisation avec un chemin vide");
        toast({
          title: "Erreur",
          description: "Impossible d'afficher le document: chemin invalide",
          variant: "destructive"
        });
        return;
      }

      // Directement mettre à jour le state pour afficher le document
      setPreviewDocument(filePath);
      console.log("[useDocumentView] Document mis en prévisualisation:", filePath);
    } catch (error) {
      console.error("[useDocumentView] Erreur lors de l'affichage du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'afficher le document",
        variant: "destructive"
      });
    }
  };

  return { handleView };
};
