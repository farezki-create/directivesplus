
import { useRef } from "react";
import SignatureCanvasLib from 'react-signature-canvas';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SignatureCanvasProps {
  signatureRef: React.RefObject<SignatureCanvasLib>;
  disabled: boolean;
}

export function SignatureCanvas({ signatureRef, disabled }: SignatureCanvasProps) {
  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Veuillez signer ci-dessous:</p>
      <Card className="p-2 border-2 border-gray-300">
        <SignatureCanvasLib 
          ref={signatureRef}
          canvasProps={{
            className: 'w-full h-[250px]'
          }}
        />
      </Card>
      <Button 
        onClick={clearSignature} 
        variant="outline"
        disabled={disabled}
        className="w-full sm:w-auto"
      >
        <X className="mr-2 h-4 w-4" />
        Effacer
      </Button>
    </div>
  );
}
