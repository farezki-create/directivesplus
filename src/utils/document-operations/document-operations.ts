
import { toast } from "@/hooks/use-toast";

/**
 * Affiche un document dans une nouvelle fenêtre
 */
export const viewDocument = async (filePath: string, contentType?: string) => {
  try {
    console.log("viewDocument appelé avec:", filePath, contentType);
    
    if (!filePath) {
      throw new Error("Chemin de fichier invalide");
    }
    
    if (filePath.startsWith('data:')) {
      // Data URL - ouvrir directement
      const newWindow = window.open();
      if (newWindow) {
        if (filePath.includes('application/pdf')) {
          // Pour les PDFs, créer une page avec un iframe
          newWindow.document.write(`
            <html>
              <head>
                <title>Aperçu du document</title>
                <style>
                  body { margin: 0; padding: 0; }
                  iframe { width: 100%; height: 100vh; border: none; }
                </style>
              </head>
              <body>
                <iframe src="${filePath}"></iframe>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          newWindow.location.href = filePath;
        }
      } else {
        throw new Error('Impossible d\'ouvrir une nouvelle fenêtre. Vérifiez que les popups sont autorisés.');
      }
      return;
    }

    // URL de fichier stocké - ouvrir directement
    const newWindow = window.open(filePath, '_blank');
    if (!newWindow) {
      throw new Error('Impossible d\'ouvrir une nouvelle fenêtre. Vérifiez que les popups sont autorisés.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'affichage du document:', error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible d'afficher le document",
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
    
    if (!filePath) {
      throw new Error("Chemin de fichier invalide");
    }
    
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

    // URL de fichier stocké - téléchargement via fetch pour éviter les problèmes CORS
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement commencé",
        description: `${fileName} est en cours de téléchargement`,
      });
    } catch (fetchError) {
      // Fallback vers la méthode directe
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
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible de télécharger le document",
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
    
    if (!filePath) {
      throw new Error("Chemin de fichier invalide");
    }
    
    if (filePath.startsWith('data:')) {
      // Data URL - impression directe
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        if (filePath.includes('application/pdf')) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Impression du document</title>
                <style>
                  body { margin: 0; padding: 0; }
                  iframe { width: 100%; height: 100vh; border: none; }
                </style>
              </head>
              <body>
                <iframe src="${filePath}" onload="setTimeout(() => window.print(), 1500);"></iframe>
              </body>
            </html>
          `);
        } else {
          printWindow.document.write(`
            <html>
              <head>
                <title>Impression du document</title>
                <style>
                  body { margin: 0; padding: 20px; text-align: center; }
                  img { max-width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <img src="${filePath}" onload="window.print();" />
              </body>
            </html>
          `);
        }
        printWindow.document.close();
      } else {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups sont autorisés.');
      }
      return;
    }

    // URL de fichier stocké - impression directe
    const printWindow = window.open(filePath, '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1500);
      };
    } else {
      throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups sont autorisés.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'impression:', error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Impossible d'imprimer le document. Vérifiez que les popups sont autorisés.",
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
