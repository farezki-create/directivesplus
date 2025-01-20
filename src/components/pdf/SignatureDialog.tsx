import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signatureData: string) => void;
}

export function SignatureDialog({ open, onOpenChange, onSign }: SignatureDialogProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSign = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        console.log("[SignatureDialog] Signature is empty");
        return;
      }
      const signatureData = signatureRef.current.toDataURL();
      console.log("[SignatureDialog] Electronic signature captured");
      onSign(signatureData);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      console.log("[SignatureDialog] Signature cleared");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Signature électronique</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Veuillez signer dans l'espace ci-dessous avec votre souris ou votre doigt
          </p>
          <div className="border rounded p-2 bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "signature-canvas",
                width: 500,
                height: 200,
                style: { width: '100%', height: '200px' }
              }}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              Effacer
            </Button>
            <Button onClick={handleSign}>
              Valider la signature
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}