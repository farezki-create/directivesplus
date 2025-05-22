
import { toast } from "@/hooks/use-toast";
import { downloadDocument } from "@/utils/document-operations";

export const useDocumentDownload = () => {
  const handleDownload = (filePath: string, fileName?: string) => {
    try {
      console.log("useDocumentDownload - handleDownload appelé pour:", filePath, fileName);
      
      // Download the document directly with the path only
      // The fileName is now optional and will be handled inside downloadDocument
      downloadDocument(filePath);
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
