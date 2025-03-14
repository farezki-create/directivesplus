
import { Button } from "@/components/ui/button";
import { FileSignature } from "lucide-react";

interface SignButtonProps {
  isSaved: boolean;
  onShowSignature: () => void;
}

export function SignButton({ isSaved, onShowSignature }: SignButtonProps) {
  if (!isSaved) {
    return null;
  }
  
  return (
    <Button
      onClick={onShowSignature}
      className="w-full"
      variant="outline"
    >
      <FileSignature className="mr-2 h-4 w-4" />
      Signer mes directives
    </Button>
  );
}
