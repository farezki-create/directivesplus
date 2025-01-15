import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

interface SubmitButtonProps {
  isDisabled: boolean;
  isSaving: boolean;
  onClick: () => void;
}

export function SubmitButton({ isDisabled, isSaving, onClick }: SubmitButtonProps) {
  const session = useSession();

  return (
    <Button
      onClick={onClick}
      className="w-full sm:w-auto"
      disabled={isDisabled || isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enregistrement en cours...
        </>
      ) : !session ? (
        'Connectez-vous pour enregistrer'
      ) : (
        'Enregistrer mes réponses'
      )}
    </Button>
  );
}