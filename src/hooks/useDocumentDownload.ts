
import { toast } from "@/hooks/use-toast";

export const useDocumentDownload = () => {
  const handleDownload = (filePath: string, fileName?: string) => {
    try {
      console.log("useDocumentDownload - handleDownload appelé pour:", filePath, fileName);
      
      // Determine the fileName if not provided
      const finalFileName = fileName || extractFileNameFromPath(filePath) || 'document.pdf';
      
      console.log("useDocumentDownload - Téléchargement avec:", filePath, finalFileName);
      
      // Handle data URLs (like base64 PDFs)
      if (filePath.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = filePath;
        link.download = finalFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Téléchargement commencé",
          description: `${finalFileName} est en cours de téléchargement`,
        });
        return;
      }
      
      // Handle regular URLs
      const link = document.createElement('a');
      link.href = filePath;
      link.download = finalFileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${finalFileName} est en cours de téléchargement`,
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

  const extractFileNameFromPath = (filePath: string): string => {
    if (!filePath) return 'document.pdf';
    
    // If it's a data URL, try to extract from base64 metadata or use default
    if (filePath.startsWith('data:')) {
      return 'document.pdf';
    }
    
    // Extract filename from path
    const pathParts = filePath.split('/');
    return pathParts[pathParts.length - 1] || 'document.pdf';
  };

  return { handleDownload };
};
