
import { toast } from "@/hooks/use-toast";

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
