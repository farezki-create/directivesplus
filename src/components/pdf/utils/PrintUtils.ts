
import { toast } from "@/hooks/use-toast";

export const createPrintWindow = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    toast({
      title: "Erreur",
      description: "Aucun PDF à imprimer",
      variant: "destructive",
    });
    return null;
  }

  try {
    // Vérifier si l'URL est valide et sécurisée
    if (!pdfUrl.startsWith('data:') && !pdfUrl.startsWith('blob:') && !pdfUrl.startsWith('http')) {
      throw new Error("URL de document non valide");
    }

    // Création d'une fenêtre d'impression plus sécurisée
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
          <script>
            function printPDF() {
              try {
                console.log("Preparing to print...");
                // Attendre que l'iframe soit complètement chargée
                setTimeout(() => {
                  window.print();
                  console.log("Print dialog opened");
                }, 1500);
              } catch (e) {
                console.error("Error during print:", e);
              }
            }
            window.onload = function() {
              // Utiliser un délai plus long pour s'assurer que tout est chargé
              setTimeout(printPDF, 1000);
            };
          </script>
        </head>
        <body>
          <iframe 
            src="${pdfUrl}" 
            type="application/pdf"
            allow="fullscreen"
          ></iframe>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups ne sont pas bloqués.",
        variant: "destructive",
      });
      return null;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    return printWindow;
  } catch (error) {
    console.error("Erreur lors de l'impression:", error);
    toast({
      title: "Erreur",
      description: error instanceof Error ? error.message : "Erreur lors de l'impression du document",
      variant: "destructive",
    });
    return null;
  }
};
