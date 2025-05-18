
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
 * Prints a document using the provided file path and file type
 */
export const printDocument = (filePath: string, fileType: string = "application/pdf") => {
  try {
    // Vérifier si c'est un fichier audio
    if (filePath.includes('audio') || (fileType && fileType.includes('audio'))) {
      toast({
        title: "Information",
        description: "L'impression n'est pas disponible pour les fichiers audio."
      });
      return;
    }

    // Pour les images et PDFs, créer une iframe optimisée pour l'impression
    if ((fileType && fileType.includes('image')) || 
        (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png'))) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Impression document</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${filePath}" />
          </body>
          </html>
        `);
        doc.close();
        
        iframe.onload = () => {
          try {
            iframe.contentWindow?.print();
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 1000);
          } catch (err) {
            console.error("Erreur lors de l'impression:", err);
            document.body.removeChild(iframe);
          }
        };
        return;
      }
    }

    // Pour les PDF et autres documents
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', function() {
        try {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        } catch (err) {
          console.error("Erreur lors de l'impression:", err);
        }
      });
    } else {
      throw new Error("Impossible d'ouvrir une nouvelle fenêtre pour l'impression.");
    }
  } catch (error) {
    console.error("Erreur lors de l'impression:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le document",
      variant: "destructive"
    });
  }
};

/**
 * Shares a document using the provided document ID
 */
export const shareDocument = (documentId: string) => {
  console.log("Partage du document:", documentId);
  toast({
    title: "Fonctionnalité en développement",
    description: "Le partage de document sera bientôt disponible. Pour envoyer un email, veuillez utiliser la fonction de partage de votre navigateur."
  });
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
