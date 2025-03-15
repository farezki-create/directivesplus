
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signatureData: string) => void;
  existingSignature?: string | null;
}

export function SignatureDialog({ open, onOpenChange, onSign, existingSignature }: SignatureDialogProps) {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSign = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        console.log("[SignatureDialog] Signature is empty");
        return;
      }
      const signatureData = signatureRef.current.toDataURL();
      console.log("[SignatureDialog] Signature captured");
      onSign(signatureData);
    }
  };

  const handleKeepExisting = () => {
    if (existingSignature) {
      console.log("[SignatureDialog] Keeping existing signature");
      onSign(existingSignature);
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
          <DialogTitle>Signer le document</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {existingSignature && (
            <div className="border rounded p-2 bg-gray-50 flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-600">Signature existante :</p>
              <img src={existingSignature} alt="Signature existante" className="max-h-[100px]" />
              <Button variant="outline" onClick={handleKeepExisting} className="mt-2">
                Ne pas modifier ma signature
              </Button>
            </div>
          )}
          <div className="border rounded p-2 bg-white">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "signature-canvas",
                width: 500,
                height: 200,
              }}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              Effacer
            </Button>
            <Button onClick={handleSign}>
              Signer le document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
