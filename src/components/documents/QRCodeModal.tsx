
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeShareMesDirectives } from "./QRCodeShareMesDirectives";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QRCodeModalProps {
  documentId: string | null;
  documentName?: string;
  onOpenChange: (open: boolean) => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  documentId,
  documentName = "Document",
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Synchroniser l'état d'ouverture avec le prop documentId
  useEffect(() => {
    const shouldOpen = !!documentId;
    setIsOpen(shouldOpen);
    
    if (shouldOpen && !documentId) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [documentId]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
    
    if (!open) {
      setHasError(false);
    }
  };

  // Validation des props
  if (isOpen && (!documentId || documentId.trim() === '')) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erreur de configuration
            </DialogTitle>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Impossible de générer le QR code : ID du document manquant ou invalide.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md print:max-w-none print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>
            Partager "{documentName}"
          </DialogTitle>
        </DialogHeader>
        
        {documentId && (
          <QRCodeShareMesDirectives 
            documentId={documentId}
            documentName={documentName}
            onClose={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
