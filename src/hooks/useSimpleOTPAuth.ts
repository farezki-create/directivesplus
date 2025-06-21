
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useSimpleOTPAuth = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');

  const sendOTP = async (userEmail: string) => {
    if (!userEmail.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre email",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: userEmail.trim(),
        options: {
          shouldCreateUser: true
        }
      });

      if (error) {
        console.error('Erreur envoi OTP:', error);
        toast({
          title: "Erreur d'envoi",
          description: "Impossible d'envoyer le code. Vérifiez votre email.",
          variant: "destructive"
        });
        return false;
      }

      setEmail(userEmail);
      setStep('otp');
      
      toast({
        title: "Code envoyé !",
        description: "Consultez votre boîte email pour le code à 6 chiffres"
      });
      
      return true;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Réessayez plus tard.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpCode: string) => {
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email'
      });

      if (error) {
        console.error('Erreur vérification OTP:', error);
        toast({
          title: "Code invalide",
          description: "Code incorrect ou expiré. Demandez un nouveau code.",
          variant: "destructive"
        });
        return false;
      }

      if (data.session && data.user) {
        toast({
          title: "Connexion réussie !",
          description: "Redirection en cours...",
        });
        
        // Redirection après succès
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendCode = () => {
    return sendOTP(email);
  };

  const goBackToEmail = () => {
    setStep('email');
    setEmail('');
  };

  return {
    loading,
    step,
    email,
    sendOTP,
    verifyOTP,
    resendCode,
    goBackToEmail
  };
};
