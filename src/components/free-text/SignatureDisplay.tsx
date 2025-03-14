
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSignature } from "lucide-react";

interface SignatureDisplayProps {
  signatureData: string | null;
  onEdit: () => void;
}

export function SignatureDisplay({ signatureData, onEdit }: SignatureDisplayProps) {
  if (!signatureData) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Signature existante:</p>
      <Card className="p-4 flex justify-center">
        <img src={signatureData} alt="Signature" className="max-h-[150px]" />
      </Card>
      <Button
        onClick={onEdit}
        variant="outline"
        className="w-full"
      >
        <FileSignature className="mr-2 h-4 w-4" />
        Modifier ma signature
      </Button>
    </div>
  );
}
