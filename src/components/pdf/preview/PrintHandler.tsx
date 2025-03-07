
import { useToast } from "@/hooks/use-toast";

interface PrintHandlerProps {
  pdfUrl: string | null;
  onNavigate: () => void;
}

export function usePrintHandler({ pdfUrl, onNavigate }: PrintHandlerProps) {
  const { toast } = useToast();

  const handlePrint = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à imprimer",
        variant: "destructive",
      });
      return;
    }

    // Créer un fichier HTML temporaire pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression</title>
          <script>
            function waitForPDFLoad() {
              var embed = document.querySelector('embed');
              var maxAttempts = 50; // 10 secondes maximum (50 * 200ms)
              var attempts = 0;

              function checkPDF() {
                attempts++;
                if (attempts >= maxAttempts) {
                  console.log('Timeout waiting for PDF');
                  return;
                }

                try {
                  if (embed && embed.clientHeight > 0) {
                    console.log('PDF loaded, preparing to print...');
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
            embed {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <embed 
            src="${pdfUrl}" 
            type="application/pdf"
          />
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
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    onNavigate();
  };

  return { handlePrint };
}
