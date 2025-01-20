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
      const signatureData = signatureRef.current.toDataURL();
      onSign(signatureData);
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Signer le document</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
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