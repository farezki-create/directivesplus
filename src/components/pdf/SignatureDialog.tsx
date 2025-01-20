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

  const handleClear = () => {
    signatureRef.current?.clear();
  };

  const handleSave = () => {
    if (signatureRef.current?.isEmpty()) {
      return;
    }
    const signatureData = signatureRef.current?.toDataURL();
    if (signatureData) {
      onSign(signatureData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signez votre document</DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: "signature-canvas w-full h-40 border rounded",
            }}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleClear}>
            Effacer
          </Button>
          <Button onClick={handleSave}>
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}