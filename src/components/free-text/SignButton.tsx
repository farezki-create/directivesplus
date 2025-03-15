
import { Button } from "@/components/ui/button";
import { FileSignature, Check } from "lucide-react";

interface SignButtonProps {
  isSaved: boolean;
  onShowSignature: () => void;
  existingSignature: string | null;
}

export function SignButton({ isSaved, onShowSignature, existingSignature }: SignButtonProps) {
  if (!isSaved) {
    return null;
  }
  
  return (
    <Button
      onClick={onShowSignature}
      className="w-full"
      variant={existingSignature ? "outline" : "default"}
    >
      {existingSignature ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Confirmer ou modifier ma signature
        </>
      ) : (
        <>
          <FileSignature className="mr-2 h-4 w-4" />
          Signer mes directives
        </>
      )}
    </Button>
  );
}
