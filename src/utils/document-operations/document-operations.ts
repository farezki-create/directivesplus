
import { toast } from "@/hooks/use-toast";

/**
 * Affiche un document dans une nouvelle fenêtre
 */
export const viewDocument = async (filePath: string, contentType?: string) => {
  try {
    console.log("viewDocument appelé avec:", filePath, contentType);
    
    if (filePath.startsWith('data:')) {
      // Data URL - ouvrir directement
      const newWindow = window.open();
      if (newWindow) {
        newWindow.location.href = filePath;
      }
      return;
    }

    // URL de fichier stocké - ouvrir directement
    window.open(filePath, '_blank');
  } catch (error) {
    console.error('Erreur lors de l\'affichage du document:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'afficher le document",
      variant: "destructive"
    });
  }
};

/**
 * Télécharge un document
 */
export const downloadDocument = async (filePath: string, fileName: string) => {
  try {
    console.log("downloadDocument appelé avec:", filePath, fileName);
    
    if (filePath.startsWith('data:')) {
      // Data URL - téléchargement direct
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
      return;
    }

    // URL de fichier stocké - téléchargement direct
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement commencé",
      description: `${fileName} est en cours de téléchargement`,
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};

/**
 * Imprime un document
 */
export const printDocument = async (filePath: string, contentType?: string) => {
  try {
    console.log("printDocument appelé avec:", filePath, contentType);
    
    if (filePath.startsWith('data:')) {
      // Data URL - impression directe
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        if (filePath.includes('application/pdf')) {
          printWindow.document.write(`
            <html>
              <head><title>Impression du document</title></head>
              <body style="margin:0;">
                <iframe src="${filePath}" width="100%" height="100%" frameborder="0"></iframe>
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                    }, 1000);
                  };
                </script>
              </body>
            </html>
          `);
        } else {
          printWindow.document.write(`
            <html>
              <head><title>Impression du document</title></head>
              <body>
                <img src="${filePath}" style="max-width:100%;" onload="window.print();" />
              </body>
            </html>
          `);
        }
        printWindow.document.close();
      } else {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
      }
      return;
    }

    // URL de fichier stocké - impression directe
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      throw new Error('Impossible d\'ouvrir la fenêtre d\'impression');
    }
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'imprimer le document. Vérifiez que les popups sont autorisés.",
      variant: "destructive"
    });
  }
};

/**
 * Partage un document
 */
export const shareDocument = async (documentId: string) => {
  // Cette fonction sera implémentée avec le système de partage unifié
  console.log('Partage du document:', documentId);
  toast({
    title: "Fonctionnalité à venir",
    description: "Le partage sera bientôt disponible",
  });
};
