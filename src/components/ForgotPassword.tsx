import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/utils/auth-errors";
import { Button } from "@/components/ui/button";

type ForgotPasswordProps = {
  email: string;
};

export const ForgotPassword = ({ email }: ForgotPasswordProps) => {
  const [lastResetRequest, setLastResetRequest] = useState(0);
  const { toast } = useToast();

  const handleForgotPassword = async () => {
    try {
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email requis",
          description: "Veuillez saisir votre adresse email avant de réinitialiser votre mot de passe.",
        });
        return;
      }

      const now = Date.now();
      if (now - lastResetRequest < 60000) {
        toast({
          variant: "destructive",
          title: "Patientez",
          description: "Pour des raisons de sécurité, veuillez patienter une minute entre chaque demande.",
        });
        return;
      }

      console.log('Attempting to send password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.log('Password reset error:', error);
        const message = getErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erreur de réinitialisation",
          description: message,
        });
        return;
      }

      setLastResetRequest(now);
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de réinitialisation.",
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleForgotPassword}
      className="w-full text-sm text-primary hover:underline mt-2"
      variant="link"
    >
      Mot de passe oublié ?
    </Button>
  );
};