import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/utils/auth-errors";

export const usePasswordReset = () => {
  const [lastResetRequest, setLastResetRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (email: string) => {
    try {
      console.log('Starting password reset request for email:', email);
      
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email requis",
          description: "Veuillez saisir votre adresse email avant de réinitialiser votre mot de passe.",
        });
        return;
      }

      if (!email.includes('@')) {
        toast({
          variant: "destructive",
          title: "Email invalide",
          description: "Veuillez saisir une adresse email valide.",
        });
        return;
      }

      const now = Date.now();
      if (now - lastResetRequest < 60000) {
        console.log('Rate limit hit on client side');
        toast({
          variant: "destructive",
          title: "Patientez",
          description: "Pour des raisons de sécurité, veuillez patienter 60 secondes entre chaque demande.",
        });
        return;
      }

      setIsLoading(true);
      console.log('Attempting to send password reset email to:', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.log('Password reset error:', error);
        
        let errorBody;
        try {
          if (typeof error.message === 'string' && error.message.includes('{')) {
            errorBody = JSON.parse(error.message.substring(error.message.indexOf('{')));
            console.log('Parsed error body:', errorBody);
          }
        } catch (e) {
          console.log('Error parsing error message:', e);
        }

        if (
          (errorBody?.code === "over_email_send_rate_limit") ||
          (error.message && error.message.toLowerCase().includes('rate limit'))
        ) {
          toast({
            variant: "destructive",
            title: "Trop de tentatives",
            description: "Pour des raisons de sécurité, veuillez patienter 60 secondes avant de réessayer.",
          });
          return;
        }

        const message = getErrorMessage(error);
        toast({
          variant: "destructive",
          title: "Erreur de réinitialisation",
          description: message,
        });
        return;
      }

      setLastResetRequest(now);
      console.log('Password reset email sent successfully');
      
      toast({
        title: "Email envoyé",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
      });
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la demande de réinitialisation.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePasswordReset,
  };
};