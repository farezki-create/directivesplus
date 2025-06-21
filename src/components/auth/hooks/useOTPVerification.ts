
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UseOTPVerificationProps {
  onSuccess?: () => void;
}

export const useOTPVerification = ({ onSuccess }: UseOTPVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyOTP = async (email: string, otpCode: string) => {
    if (otpCode.length !== 6) {
      setError('Le code doit contenir exactement 6 chiffres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 [AUTH-OTP] Vérification OTP pour:', email.substring(0, 3) + '***');
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email',
      });

      if (verifyError) {
        console.error('❌ [AUTH-OTP] Erreur vérification:', verifyError);
        throw verifyError;
      }

      if (!data.session || !data.user) {
        setError('Code invalide ou session non créée. Veuillez réessayer.');
        return;
      }
      
      console.log('✅ [AUTH-OTP] Connexion réussie pour utilisateur:', data.user.id);
      
      toast({
        title: "Connexion réussie !",
        description: "Vous êtes maintenant connecté.",
        duration: 3000
      });

      // Redirection après succès
      if (onSuccess) {
        onSuccess();
      } else {
        // Attendre un peu avant la redirection pour que l'utilisateur voit le message de succès
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1500);
      }

    } catch (err: any) {
      console.error('❌ [AUTH-OTP] Erreur vérification OTP:', err);
      
      let errorMessage = 'Code invalide ou expiré. Veuillez réessayer.';
      
      if (err.message?.includes('invalid_token')) {
        errorMessage = 'Code invalide. Vérifiez le code reçu par email.';
      } else if (err.message?.includes('expired')) {
        errorMessage = 'Code expiré. Demandez un nouveau code.';
      } else if (err.message?.includes('signup disabled')) {
        errorMessage = 'Les inscriptions sont temporairement désactivées.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    verifyOTP
  };
};
