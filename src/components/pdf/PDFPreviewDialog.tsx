import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer, FileText } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string | null;
  onEmail: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export function PDFPreviewDialog({
  open,
  onOpenChange,
  pdfUrl,
  onSave,
  onPrint,
}: PDFPreviewDialogProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSend = async () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à envoyer",
        variant: "destructive",
      });
      return;
    }

    if (!emailAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-pdf-email', {
        body: {
          pdfUrl,
          recipientEmail: emailAddress,
        },
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le PDF a été envoyé par email",
      });
      setEmailAddress("");
      onOpenChange(false);
      navigate("/generate-pdf");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le PDF par email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = () => {
    onSave();
    onOpenChange(false);
    navigate("/generate-pdf");
  };

  const handlePrint = () => {
    if (!pdfUrl) {
      toast({
        title: "Erreur",
        description: "Aucun PDF à imprimer",
        variant: "destructive",
      });
      return;
    }

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
    
    onOpenChange(false);
    navigate("/generate-pdf");
  };

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <FileText 
          className="w-16 h-16 text-primary animate-bounce" 
          style={{ animationDuration: '2s' }}
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]"
              style={{
                width: '100%',
                animation: 'loading 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 animate-pulse">
        Préparation de votre document...
      </p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
        <style>
          {`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>

        <div className="flex flex-col space-y-4 h-full">
          <div className="flex justify-end space-x-2">
            <div className="flex items-center space-x-2 mr-auto">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-64"
              />
              <Button 
                variant="outline" 
                onClick={handleEmailSend}
                disabled={isSending}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isSending ? "Envoi..." : "Envoyer par email"}
              </Button>
            </div>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
          
          <div className="flex-1 min-h-[500px] border rounded">
            {!pdfUrl ? (
              <LoadingAnimation />
            ) : (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
                onLoad={() => setIsLoading(false)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
