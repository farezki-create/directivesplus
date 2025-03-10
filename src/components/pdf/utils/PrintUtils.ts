
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

  // Create a dedicated print window with the PDF embedded directly
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .pdf-container {
            width: 100%;
            height: 100%;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          @media print {
            @page {
              size: auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .pdf-container {
              width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="pdf-container">
          <iframe 
            src="${pdfUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0"
            onload="setTimeout(function() { window.print(); }, 1000);"
          ></iframe>
        </div>
        <script>
          // Fallback in case onload doesn't trigger
          window.addEventListener('load', function() {
            setTimeout(function() {
              if (!window.printed) {
                window.printed = true;
                window.print();
              }
            }, 2000);
          });
        </script>
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
