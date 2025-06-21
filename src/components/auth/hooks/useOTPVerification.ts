
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
      console.log('🔐 [SIMPLE-OTP] Vérification OTP pour:', email.substring(0, 3) + '***');
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email',
      });

      if (verifyError) {
        throw verifyError;
      }

      if (!data.session) {
        setError('Code invalide ou session non créée. Veuillez réessayer.');
        return;
      }
      
      console.log('✅ [SIMPLE-OTP] Connexion réussie');
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.href = '/profile';
      }

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur vérification OTP:', err);
      setError('Code invalide ou expiré. Veuillez réessayer.');
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
