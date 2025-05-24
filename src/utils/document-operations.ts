
import { toast } from "@/hooks/use-toast";

export const downloadDocument = (filePath: string, fileName?: string) => {
  try {
    console.log("downloadDocument appelé avec:", filePath, fileName);
    
    // Handle base64 data URLs
    if (filePath.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = filePath;
      
      // Extract filename from the data URL or use provided fileName
      let downloadName = fileName;
      if (!downloadName) {
        const filenameMatch = filePath.match(/filename=([^;]+)/);
        downloadName = filenameMatch ? filenameMatch[1] : 'document.pdf';
      }
      
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // Handle regular URLs
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName || filePath.split('/').pop() || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};

export const printDocument = (filePath: string) => {
  try {
    console.log("printDocument appelé avec:", filePath);
    
    // Handle base64 data URLs
    if (filePath.startsWith('data:')) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const fileType = filePath.split(';')[0].split(':')[1];
        
        if (fileType === 'application/pdf') {
          printWindow.document.write(`
            <html>
              <head><title>Impression</title></head>
              <body style="margin:0; padding:0;">
                <embed src="${filePath}" type="application/pdf" width="100%" height="100%" />
              </body>
            </html>
          `);
        } else if (fileType.startsWith('image/')) {
          printWindow.document.write(`
            <html>
              <head><title>Impression</title></head>
              <body style="margin:0; padding:0; text-align:center;">
                <img src="${filePath}" style="max-width:100%; max-height:100%;" onload="window.print(); window.close();" />
              </body>
            </html>
          `);
        }
        
        printWindow.document.close();
        if (fileType === 'application/pdf') {
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        }
      }
      return;
    }
    
    // Handle regular URLs
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
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

export const viewDocument = (filePath: string) => {
  try {
    console.log("viewDocument appelé avec:", filePath);
    
    // Handle base64 data URLs - open in new tab
    if (filePath.startsWith('data:')) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        const fileType = filePath.split(';')[0].split(':')[1];
        
        if (fileType === 'application/pdf') {
          newWindow.document.write(`
            <html>
              <head><title>Visualisation du document</title></head>
              <body style="margin:0; padding:0;">
                <embed src="${filePath}" type="application/pdf" width="100%" height="100%" />
              </body>
            </html>
          `);
        } else if (fileType.startsWith('image/')) {
          newWindow.document.write(`
            <html>
              <head><title>Visualisation du document</title></head>
              <body style="margin:0; padding:0; text-align:center; background:#f5f5f5;">
                <img src="${filePath}" style="max-width:100%; max-height:100%;" />
              </body>
            </html>
          `);
        } else {
          newWindow.location.href = filePath;
        }
        
        newWindow.document.close();
      }
      return;
    }
    
    // Handle regular URLs
    window.open(filePath, '_blank');
  } catch (error) {
    console.error("Erreur lors de l'affichage:", error);
    toast({
      title: "Erreur",
      description: "Impossible d'afficher le document",
      variant: "destructive"
    });
  }
};
