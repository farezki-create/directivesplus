
import { toast } from "@/hooks/use-toast";

/**
 * Downloads a document using the provided file path and name
 */
export const downloadDocument = (filePath: string, fileName: string) => {
  try {
    // If it's a data URI (base64)
    if (filePath.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
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
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
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

/**
 * Shares a document using the provided document ID
 * Improved sharing functionality using Web Share API if available
 */
export const shareDocument = async (documentId: string) => {
  try {
    const shareUrl = `${window.location.origin}/partage-document/${documentId}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      await navigator.share({
        title: "Partage de document DirectivesPlus",
        text: "Consultez ce document sur DirectivesPlus",
        url: shareUrl
      });
      
      toast({
        title: "Partage réussi",
        description: "Le document a été partagé avec succès"
      });
    } else {
      // Fallback for browsers without Web Share API
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans votre presse-papiers"
      });
    }
  } catch (error) {
    console.error("Erreur lors du partage du document:", error);
    // Don't show error for user-aborted sharing
    if (error.name !== "AbortError") {
      toast({
        title: "Information",
        description: "Le dialogue de partage a été ouvert. Utilisez les options disponibles pour partager le document."
      });
    }
  }
};

/**
 * Views a document using the provided file path and file type
 */
export const viewDocument = (
  filePath: string, 
  fileType: string = "application/pdf", 
  setPreviewDocument: (path: string | null) => void
) => {
  try {
    console.log("Visualisation du document:", filePath, fileType);
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
