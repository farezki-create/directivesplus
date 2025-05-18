
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
    
    // Set the document to preview directly
    setPreviewDocument(filePath);
    
    console.log("viewDocument - Document prévisualisé avec succès:", filePath);
  } catch (error) {
    console.error("Erreur lors de l'ouverture du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'ouvrir le document",
      variant: "destructive"
    });
  }
};
