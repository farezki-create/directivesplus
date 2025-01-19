import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const handleClear = () => {
    console.log("[SignaturePad] Clearing signature");
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleEndDrawing = () => {
    console.log("[SignaturePad] End drawing, attempting to save signature");
    if (signaturePadRef.current) {
      if (signaturePadRef.current.isEmpty()) {
        console.log("[SignaturePad] Signature pad is empty");
        return;
      }

      const signatureData = signaturePadRef.current.toDataURL();
      console.log("[SignaturePad] Signature captured successfully");
      onSave(signatureData);
      
      toast({
        title: "Succès",
        description: "Signature sauvegardée avec succès",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-2">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: "signature-canvas w-full h-[200px]",
          }}
          onEnd={handleEndDrawing}
        />
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleClear}>
          Effacer
        </Button>
      </div>
    </div>
  );
}