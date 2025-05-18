
export const detectDocumentType = (filePath: string) => {
  const isAudio = 
    filePath.includes('audio') || 
    filePath.endsWith('.mp3') || 
    filePath.endsWith('.wav') || 
    filePath.endsWith('.ogg');
  
  const isPdf = 
    filePath.includes('pdf') || 
    filePath.endsWith('.pdf') || 
    filePath.includes('application/pdf');
  
  const isImage = 
    filePath.includes('image') || 
    filePath.endsWith('.jpg') || 
    filePath.endsWith('.jpeg') || 
    filePath.endsWith('.png') || 
    filePath.endsWith('.gif') || 
    filePath.includes('image/jpeg') || 
    filePath.includes('image/png');

  return { isAudio, isPdf, isImage };
};

export const downloadFile = (filePath: string, toast: any) => {
  try {
    console.log("downloadFile - Téléchargement du fichier:", filePath);
    const fileName = filePath.split('/').pop() || 'document';
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
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    toast({
      title: "Erreur",
      description: "Impossible de télécharger le document",
      variant: "destructive"
    });
  }
};

export const printDocument = (filePath: string, isImage: boolean, toast: any) => {
  try {
    console.log("printDocument - Impression du fichier:", filePath, "isImage:", isImage);
    if (isImage) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Impression</title>
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { max-width: 100%; max-height: 90vh; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${filePath}" alt="Document à imprimer" />
              <script>
                window.onload = function() {
                  setTimeout(function() { window.print(); }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      return;
    }
    
    // Pour PDF et autres types
    const printWindow = window.open(filePath, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
    } else {
      throw new Error("Impossible d'ouvrir une fenêtre d'impression");
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
