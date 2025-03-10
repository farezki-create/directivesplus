
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

  // Vérifier que l'URL est valide (blob: ou data:)
  const isValidPdfUrl = pdfUrl.startsWith("blob:") || pdfUrl.startsWith("data:");
  if (!isValidPdfUrl) {
    toast({
      title: "Erreur",
      description: "Format de document non valide",
      variant: "destructive",
    });
    return null;
  }

  console.log("[PrintUtils] Opening print window with PDF URL:", pdfUrl.substring(0, 30) + "...");

  // Create a temporary HTML file for printing
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression</title>
        <script>
          function waitForPDFLoad() {
            var iframe = document.querySelector('iframe');
            var maxAttempts = 50; // 10 seconds maximum (50 * 200ms)
            var attempts = 0;

            function checkPDF() {
              attempts++;
              if (attempts >= maxAttempts) {
                console.log('Timeout waiting for PDF');
                window.print();
                return;
              }

              try {
                // For iframe-based PDF viewer
                if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                  console.log('PDF loaded in iframe, preparing to print...');
                  setTimeout(function() {
                    window.print();
                  }, 1000);
                } else {
                  setTimeout(checkPDF, 200);
                }
              } catch (e) {
                console.error('Error checking PDF:', e);
                setTimeout(checkPDF, 200);
              }
            }

            checkPDF();
          }
          window.onload = waitForPDFLoad;
        </script>
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
          @media print {
            body, html, iframe {
              height: 100%;
              width: 100%;
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <iframe 
          src="${pdfUrl}" 
          style="width:100%; height:100%; border:none;"
          sandbox="allow-same-origin allow-scripts"
        ></iframe>
      </body>
    </html>
  `;

  // Ouvrir une nouvelle fenêtre avec le contenu
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast({
      title: "Erreur",
      description: "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les popups ne sont pas bloqués.",
      variant: "destructive",
    });
    return null;
  }

  // Écrire le contenu et fermer le document
  printWindow.document.write(printContent);
  printWindow.document.close();
  
  return printWindow;
};

// Fonction pour libérer les ressources des Blob URLs
export const revokePdfUrl = (pdfUrl: string | null) => {
  if (pdfUrl && pdfUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(pdfUrl);
      console.log("[PrintUtils] Revoked blob URL");
    } catch (error) {
      console.error("[PrintUtils] Error revoking blob URL:", error);
    }
  }
};
