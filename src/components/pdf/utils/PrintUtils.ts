
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

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression</title>
        <script>
          function waitForPDFLoad() {
            var iframe = document.querySelector('iframe');
            var maxAttempts = 200; // Increase maximum attempts
            var attempts = 0;
            var printInitiated = false;

            function checkPDF() {
              attempts++;
              if (attempts >= maxAttempts) {
                console.log('Timeout waiting for PDF, trying to print anyway...');
                if (!printInitiated) {
                  printInitiated = true;
                  setTimeout(function() { window.print(); }, 1000);
                }
                return;
              }

              try {
                if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                  console.log('PDF loaded in iframe, preparing to print...');
                  if (!printInitiated) {
                    printInitiated = true;
                    setTimeout(function() { window.print(); }, 2000); // Longer delay for PDF rendering
                  }
                } else {
                  setTimeout(checkPDF, 100);
                }
              } catch (e) {
                console.error('Error checking PDF:', e);
                setTimeout(checkPDF, 100);
              }
            }

            window.addEventListener('load', function() {
              setTimeout(checkPDF, 500); // Initial delay before checking
            });
          }
          
          // Start the PDF load check when window loads
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
          sandbox="allow-same-origin allow-scripts allow-forms"
          referrerpolicy="no-referrer"
          type="application/pdf"
        ></iframe>
      </body>
    </html>
  `;

  try {
    // Use _blank for a new window to avoid security restrictions
    const printWindow = window.open('', '_blank', 'width=800,height=600');
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
    console.error("[PrintUtils] Error creating print window:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ouverture de la fenêtre d'impression.",
      variant: "destructive",
    });
    return null;
  }
};

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
