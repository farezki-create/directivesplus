
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SignatureActionsProps {
  onSaveSignature: () => void;
  loading: boolean;
}

export function SignatureActions({ onSaveSignature, loading }: SignatureActionsProps) {
  return (
    <Button 
      onClick={onSaveSignature} 
      className="w-full"
      disabled={loading}
    >
      <Check className="mr-2 h-4 w-4" />
      Confirmer ma signature
    </Button>
  );
}
