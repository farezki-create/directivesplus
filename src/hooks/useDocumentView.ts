
import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";

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

      // Utilisation directe de setPreviewDocument pour assurer que la mise à jour est effectuée
      setPreviewDocument(filePath);
      console.log("Document mis en prévisualisation:", filePath);
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
