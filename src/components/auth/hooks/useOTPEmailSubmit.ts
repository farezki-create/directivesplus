
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

      // Success - gestion plus simple des tentatives
      const newAttemptCount = attemptCount + 1;
      onAttemptIncrement(newAttemptCount);
      
      console.log('✅ [SIMPLE-OTP] Email envoyé avec succès');
      
      toast({
        title: "Code envoyé avec succès !",
        description: "Consultez votre boîte email (et les spams) pour le code à 6 chiffres.",
      });

      // Clear any previous errors before calling onSuccess
      setError('');
      onSuccess();

    } catch (err: any) {
      console.error('❌ [SIMPLE-OTP] Erreur envoi OTP:', err);

      // Gestion simplifiée des erreurs de rate limit
      if (err.status === 429 || err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
        console.log('⚠️ [SIMPLE-OTP] Rate limit détecté - gestion simplifiée');
        onRateLimitError();
        setError('');
      } else {
        // Messages d'erreur plus simples et moins techniques
        let errorMessage = 'Impossible d\'envoyer le code pour le moment.';
        
        if (err.message?.includes('Invalid email')) {
          errorMessage = 'Format d\'email invalide. Vérifiez votre adresse.';
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = 'Problème de connexion. Vérifiez votre internet et réessayez.';
        }
        
        // Incrémenter les tentatives même en cas d'erreur, mais de façon plus tolérante
        const newAttemptCount = attemptCount + 1;
        onAttemptIncrement(newAttemptCount);
        
        setError(errorMessage);
        toast({
          title: "Envoi temporairement indisponible",
          description: errorMessage + " Réessayez dans quelques instants.",
          variant: "default", // Moins alarmant
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
