
import { toast } from "@/hooks/use-toast";
import { downloadDocument } from "@/utils/document-operations";

export const useDocumentDownload = () => {
  const handleDownload = (filePath: string, fileName: string) => {
    try {
      console.log("useDocumentDownload - handleDownload appelé pour:", filePath, fileName);
      
      // Télécharger directement le document
      downloadDocument(filePath, fileName);
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  return { handleDownload };
};
