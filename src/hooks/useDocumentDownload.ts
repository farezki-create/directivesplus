import { toast } from "@/hooks/use-toast";
import { useDocumentPreview } from "./useDocumentPreview";
import { downloadDocument } from "@/utils/documentOperations";

export const useDocumentDownload = () => {
  const { setPreviewDocument } = useDocumentPreview();

  const handleDownload = (filePath: string, fileName: string) => {
    try {
      // For audio or other previewable file formats, show in a dialog
      if (filePath.includes('audio') || 
          filePath.includes('pdf') || 
          filePath.includes('image') ||
          filePath.endsWith('.jpg') || 
          filePath.endsWith('.jpeg') || 
          filePath.endsWith('.png') || 
          filePath.endsWith('.pdf')) {
        setPreviewDocument(filePath);
        return;
      }
      
      // Otherwise, download the file
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
