
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
      console.log('📧 [AUTH-OTP] Tentative envoi OTP pour:', email.substring(0, 3) + '***');
      
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            email_confirmed: false
          }
        },
      });

      if (signInError) {
        console.error('❌ [AUTH-OTP] Erreur Supabase:', signInError);
        throw signInError;
      }

      console.log('✅ [AUTH-OTP] Email envoyé avec succès');
      
      toast({
        title: "Code envoyé !",
        description: "Consultez votre boîte email (et les spams) pour le code à 6 chiffres.",
        duration: 5000
      });

      setError('');
      onSuccess();

    } catch (err: any) {
      console.error('❌ [AUTH-OTP] Erreur envoi OTP:', err);

      let errorMessage = 'Impossible d\'envoyer le code pour le moment.';
      let isRateLimit = false;
      
      // Gestion spécifique des erreurs Supabase
      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.';
        isRateLimit = true;
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Format d\'email invalide. Vérifiez votre adresse.';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Problème de connexion. Vérifiez votre internet et réessayez.';
      } else if (err.message?.includes('signup disabled')) {
        errorMessage = 'Les inscriptions sont temporairement désactivées.';
      } else if (err.message) {
        // Afficher le message d'erreur exact de Supabase pour debug
        console.log('Message d\'erreur détaillé:', err.message);
      }
      
      if (isRateLimit) {
        onRateLimitError();
      }
      
      setError(errorMessage);
      toast({
        title: "Envoi impossible",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });
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
