import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: (signatureData: string) => void;
}

export function SignatureDialog({ open, onOpenChange, onSign }: SignatureDialogProps) {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = () => {
    if (signatureRef.current && !isEmpty) {
      const signatureData = signatureRef.current.toDataURL();
      onSign(signatureData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signature</DialogTitle>
        </DialogHeader>
        <div className="border rounded-lg p-4">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: "w-full h-40 border border-gray-200 rounded-lg",
            }}
            onBegin={() => setIsEmpty(false)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClear}>
            Effacer
          </Button>
          <Button onClick={handleSave} disabled={isEmpty}>
            Valider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}