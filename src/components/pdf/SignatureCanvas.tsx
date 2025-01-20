import React, { useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SignatureCanvasProps {
  onSave: (signatureData: string) => void;
}

export function SignatureCanvas({ onSave }: SignatureCanvasProps) {
  const signaturePadRef = useRef<SignaturePad>(null);
  const { toast } = useToast();

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current) {
      if (signaturePadRef.current.isEmpty()) {
        toast({
          title: "Erreur",
          description: "Veuillez signer avant de continuer",
          variant: "destructive",
        });
        return;
      }
      const signatureData = signaturePadRef.current.toDataURL();
      onSave(signatureData);
      toast({
        title: "Succès",
        description: "Signature enregistrée avec succès",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="border border-gray-300 rounded">
        <SignaturePad
          ref={signaturePadRef}
          canvasProps={{
            className: "signature-canvas",
            width: 500,
            height: 200,
          }}
        />
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleClear}>
          Effacer
        </Button>
        <Button onClick={handleSave}>
          Signer le document
        </Button>
      </div>
    </div>
  );
}