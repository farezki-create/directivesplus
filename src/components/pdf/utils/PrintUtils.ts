
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
              // Give the iframe time to fully load
              setTimeout(() => {
                window.print();
                console.log("Print dialog opened");
              }, 1000);
            } catch (e) {
              console.error("Error during print:", e);
            }
          }
          window.onload = printPDF;
        </script>
      </head>
      <body>
        <iframe 
          src="${pdfUrl}" 
          type="application/pdf"
          onload="printPDF()"
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
