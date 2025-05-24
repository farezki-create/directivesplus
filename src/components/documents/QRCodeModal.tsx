
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QRCodeModalProps {
  sharedCode: string | null;
  onOpenChange: (open: boolean) => void;
  documentName?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  sharedCode,
  onOpenChange,
  documentName = "Document"
}) => {
  if (!sharedCode) return null;

  const shareUrl = `${window.location.origin}/partage/${sharedCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans le presse-papiers",
      });
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handleOpenLink = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={!!sharedCode} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Partager par QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center">
            <h3 className="font-medium mb-2">{documentName}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Scannez ce QR code ou utilisez le lien pour accéder au document
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <QRCodeSVG 
              value={shareUrl} 
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>

          <div className="w-full space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Lien de partage:</p>
              <p className="text-sm break-all font-mono">{shareUrl}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <Copy size={16} />
                Copier le lien
              </Button>
              
              <Button 
                onClick={handleOpenLink}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Ouvrir
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>⚠️ Partagez ce lien uniquement avec des personnes de confiance</p>
            <p>Le code d'accès peut expirer selon vos paramètres</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
