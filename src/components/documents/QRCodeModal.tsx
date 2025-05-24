
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeShareMesDirectives } from "./QRCodeShareMesDirectives";

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
  return (
    <Dialog open={!!documentId} onOpenChange={onOpenChange}>
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
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
