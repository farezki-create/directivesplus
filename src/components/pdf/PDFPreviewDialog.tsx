
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
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
    onPrint();
    onOpenChange(false);
    navigate("/generate-pdf");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Prévisualisation du document
        </DialogTitle>
        
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
          
          {pdfUrl ? (
            <div className="flex-1 min-h-[500px] border rounded">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Aucun document à afficher
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
