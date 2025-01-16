import { Button } from "@/components/ui/button";
import { usePasswordReset } from "@/hooks/usePasswordReset";

type ForgotPasswordProps = {
  email: string;
};

export const ForgotPassword = ({ email }: ForgotPasswordProps) => {
  const { isLoading, handlePasswordReset } = usePasswordReset();

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={() => handlePasswordReset(email)}
        className="w-full text-sm text-primary hover:underline"
        variant="link"
        disabled={isLoading}
      >
        {isLoading ? "Envoi en cours..." : "Mot de passe oublié ?"}
      </Button>
      <p className="text-xs text-muted-foreground text-center px-4">
        Un email vous sera envoyé avec les instructions pour réinitialiser votre mot de passe
      </p>
    </div>
  );
};