import { Button } from "@/components/ui/button";
import { usePasswordReset } from "@/hooks/usePasswordReset";

type ForgotPasswordProps = {
  email: string;
};

export const ForgotPassword = ({ email }: ForgotPasswordProps) => {
  const { isLoading, handlePasswordReset } = usePasswordReset();

  return (
    <Button
      type="button"
      onClick={() => handlePasswordReset(email)}
      className="w-full text-sm text-primary hover:underline mt-2"
      variant="link"
      disabled={isLoading}
    >
      {isLoading ? "Envoi en cours..." : "Mot de passe oublié ?"}
    </Button>
  );
};