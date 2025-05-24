
import { toast } from "@/hooks/use-toast";
import { downloadDocument } from "@/utils/document-operations";

export const useDocumentDownload = () => {
  const handleDownload = (filePath: string, fileName?: string) => {
    try {
      console.log("useDocumentDownload - handleDownload appelé pour:", filePath, fileName);
      
      // Determine the fileName if not provided
      const finalFileName = fileName || extractFileNameFromPath(filePath) || 'document';
      
      console.log("useDocumentDownload - Calling downloadDocument with:", filePath, finalFileName);
      downloadDocument(filePath, finalFileName);
    } catch (error) {
      console.error("Erreur lors du téléchargement du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const extractFileNameFromPath = (filePath: string): string => {
    if (!filePath) return 'document';
    
    // If it's a data URL, try to extract from base64 metadata or use default
    if (filePath.startsWith('data:')) {
      return 'document';
    }
    
    // Extract filename from path
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 1] || 'document';
  };

  return { handleDownload };
};
