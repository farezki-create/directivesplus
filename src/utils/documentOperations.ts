
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

/**
 * Shares a document using the provided document ID
 * Improved sharing functionality using Web Share API if available
 */
export const shareDocument = async (documentId: string) => {
  try {
    const shareUrl = `${window.location.origin}/partage-document/${documentId}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Partage de document DirectivesPlus",
          text: "Consultez ce document sur DirectivesPlus",
          url: shareUrl
        });
        
        toast({
          title: "Partage réussi",
          description: "Le document a été partagé avec succès"
        });
      } catch (error: any) {
        // Si l'utilisateur annule le partage ou si une autre erreur se produit
        console.error("Erreur lors du partage:", error);
        
        // On n'affiche pas d'erreur pour une annulation
        if (error.name !== "AbortError") {
          throw error; // Relancer l'erreur pour le bloc catch externe
        }
      }
    } else {
      // Fallback pour les navigateurs sans Web Share API
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans votre presse-papiers"
      });
    }
  } catch (error) {
    console.error("Erreur lors du partage du document:", error);
    toast({
      title: "Erreur",
      description: "Impossible de partager le document. Vérifiez les permissions de votre navigateur.",
      variant: "destructive"
    });
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

/**
 * Prints a document using the provided file path and file type
 */
export const printDocument = (filePath: string, fileType: string = "application/pdf") => {
  try {
    console.log("printDocument - Impression du document:", filePath, fileType);
    
    if (!filePath) {
      throw new Error("Chemin de fichier invalide");
    }
    
    // Vérifier si c'est un fichier audio
    if (filePath.includes('audio') || (fileType && fileType.includes('audio'))) {
      toast({
        title: "Information",
        description: "L'impression n'est pas disponible pour les fichiers audio."
      });
      return;
    }
    
    // Optimisation pour impression d'images
    if (fileType && fileType.includes('image') || 
        filePath.includes('image') || 
        filePath.endsWith('.jpg') || 
        filePath.endsWith('.png') || 
        filePath.endsWith('.jpeg')) {
        
      // Créer une nouvelle fenêtre pour impression optimisée
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Impression d'image</title>
              <style>
                body { 
                  margin: 0; 
                  display: flex; 
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                img { max-width: 100%; max-height: 90vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${filePath}" alt="Document à imprimer" />
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                  }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return;
      }
    }
    
    // Pour les PDF, ouvrir directement pour impression
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    } else {
      throw new Error("Impossible d'ouvrir une nouvelle fenêtre. Vérifiez que les popups sont autorisés.");
    }
  } catch (error) {
    console.error("Erreur lors de l'impression:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le document. Vérifiez que les popups sont autorisés.",
      variant: "destructive"
    });
  }
};
