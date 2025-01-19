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
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current) {
      if (signaturePadRef.current.isEmpty()) {
        toast({
          title: "Erreur",
          description: "Veuillez signer avant de sauvegarder",
          variant: "destructive",
        });
        return;
      }

      const signatureData = signaturePadRef.current.toDataURL();
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
        />
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleClear}>
          Effacer
        </Button>
        <Button onClick={handleSave}>
          Sauvegarder la signature
        </Button>
      </div>
    </div>
  );
}