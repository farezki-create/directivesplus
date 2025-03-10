
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

  // Create a temporary HTML file for printing
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression</title>
        <script>
          function waitForPDFLoad() {
            var iframe = document.getElementById('pdf-iframe');
            var maxAttempts = 50; // 10 seconds maximum (50 * 200ms)
            var attempts = 0;

            function checkPDF() {
              attempts++;
              if (attempts >= maxAttempts) {
                console.log('Timeout waiting for PDF');
                return;
              }

              try {
                if (iframe && iframe.contentWindow.document.readyState === 'complete') {
                  console.log('PDF loaded, preparing to print...');
                  setTimeout(function() {
                    window.print();
                    window.focus();
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
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
          }
        </style>
      </head>
      <body>
        <iframe 
          id="pdf-iframe"
          src="${pdfUrl}" 
          type="application/pdf"
          width="100%"
          height="100%"
          frameborder="0"
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
};

export const printPDF = (pdfUrl: string | null) => {
  if (!pdfUrl) {
    toast({
      title: "Erreur",
      description: "Aucun PDF à imprimer",
      variant: "destructive",
    });
    return false;
  }

  try {
    const printWindow = createPrintWindow(pdfUrl);
    if (!printWindow) {
      return false;
    }
    
    // Focus on the new window to bring print dialog to front
    printWindow.focus();
    return true;
  } catch (error) {
    console.error("[PrintUtils] Error printing PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'impression",
      variant: "destructive",
    });
    return false;
  }
};
