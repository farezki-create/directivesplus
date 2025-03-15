
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature, Check, Edit } from "lucide-react";

interface SignatureDisplayProps {
  signatureData: string | null;
  onEdit: () => void;
  onConfirm?: () => void;
}

export function SignatureDisplay({ signatureData, onEdit, onConfirm }: SignatureDisplayProps) {
  if (!signatureData) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Signature existante:</p>
      <Card className="p-4 flex justify-center">
        <img src={signatureData} alt="Signature" className="max-h-[150px]" />
      </Card>
      <div className="flex flex-col space-y-2">
        <Button
          onClick={onEdit}
          variant="outline"
          className="w-full"
        >
          <Edit className="mr-2 h-4 w-4" />
          Modifier ma signature
        </Button>
        
        {onConfirm && (
          <Button
            onClick={onConfirm}
            className="w-full"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirmer cette signature
          </Button>
        )}
      </div>
    </div>
  );
}
