
import { toast } from "@/hooks/use-toast";

/**
 * Views a document using the provided file path and file type
 */
export const viewDocument = (
  filePath: string, 
  fileType: string = "application/pdf", 
  setPreviewDocument: (path: string | null) => void
) => {
  try {
    console.log("viewDocument - Visualisation du document:", filePath, fileType);
    
    if (!filePath) {
      throw new Error("Chemin de fichier invalide");
    }
    
    setPreviewDocument(filePath);
  } catch (error) {
    console.error("Erreur lors de l'ouverture du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'ouvrir le document",
      variant: "destructive"
    });
  }
};
