
import { toast } from "@/hooks/use-toast";

export const useDocumentPrint = () => {
  const handlePrint = (filePath: string, fileType: string = "") => {
    try {
      
      
      // Handle data URLs (like base64 PDFs)
      if (filePath.startsWith('data:')) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          // For PDF data URLs, embed in an iframe for better printing
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
          throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups sont autorisés.');
        }
        return;
      }
      
      // Handle regular URLs
      const printWindow = window.open(filePath, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      } else {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups sont autorisés.');
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

  return { handlePrint };
};
