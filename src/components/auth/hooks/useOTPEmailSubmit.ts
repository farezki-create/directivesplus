
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UseOTPEmailSubmitProps {
  onSuccess: () => void;
  onAttemptIncrement: (count: number) => void;
  onRateLimitError: () => void;
  checkCooldown: () => string | null;
  attemptCount: number;
}

export const useOTPEmailSubmit = ({
  onSuccess,
  onAttemptIncrement,
  onRateLimitError,
  checkCooldown,
  attemptCount
}: UseOTPEmailSubmitProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitEmail = async (email: string) => {
    const cooldownError = checkCooldown();
    if (cooldownError) {
      setError(cooldownError);
      return;
    }

    if (!email.trim()) {
      setError('Veuillez saisir votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir un email valide');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📧 [SIMPLE-OTP] Tentative envoi OTP pour:', email.substring(0, 3) + '***');
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });

      if (signInError) {
        throw signInError;
      }

      // Success - increment attempt count and set last sent time
      const newAttemptCount = attemptCount + 1;
      onAttemptIncrement(newAttemptCount);
      
      onSuccess();
      
      toast({
        title: "Code envoyé",
        description: "Vérifiez votre boîte email pour le code à 6 chiffres.",
      });

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP:', err);

      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        onRateLimitError();
        setError('');
      } else {
        // Increment attempt count even on error
        const newAttemptCount = attemptCount + 1;
        onAttemptIncrement(newAttemptCount);
        
        setError('Erreur lors de l\'envoi du code. Vérifiez votre email et réessayez.');
        toast({
          title: "Erreur d'envoi",
          description: "Impossible d'envoyer le code. Vérifiez votre email.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    submitEmail
  };
};
