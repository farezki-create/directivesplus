
import { toast } from "@/hooks/use-toast";

/**
 * Downloads a document using the provided file path and name
 */
export const downloadDocument = (filePath: string, fileName: string) => {
  try {
    console.log("downloadDocument - Téléchargement du document:", filePath, fileName);
    
    // If it's a data URI (base64)
    if (filePath.startsWith('data:')) {
      console.log("downloadDocument - Téléchargement d'un data URI");
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement réussi",
        description: "Votre document a été téléchargé avec succès"
      });
      return;
    }
    
    // For other document types
    console.log("downloadDocument - Téléchargement d'une URL standard");
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName || filePath.split('/').pop() || "document";
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Document téléchargé",
      description: "Votre document a été téléchargé avec succès"
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};
