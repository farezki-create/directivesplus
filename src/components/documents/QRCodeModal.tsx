
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeShareMesDirectives } from "./QRCodeShareMesDirectives";

interface QRCodeModalProps {
  sharedCode: string | null;
  onOpenChange: (open: boolean) => void;
  documentName?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  sharedCode,
  onOpenChange,
  documentName
}) => {
  return (
    <Dialog open={!!sharedCode} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md print:max-w-none print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>
            Partager "{documentName}"
          </DialogTitle>
        </DialogHeader>
        
        {sharedCode && (
          <QRCodeShareMesDirectives 
            sharedCode={sharedCode}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
