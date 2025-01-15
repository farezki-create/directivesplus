import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isDisabled: boolean;
  isSaving: boolean;
  onClick: () => void;
}

export function SubmitButton({ isDisabled, isSaving, onClick }: SubmitButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full sm:w-auto"
      disabled={isDisabled}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enregistrement...
        </>
      ) : (
        'Enregistrer mes réponses'
      )}
    </Button>
  );
}