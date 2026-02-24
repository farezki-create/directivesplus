
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
      await supabase.auth.signOut({ scope: 'global' });
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userEmail.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('❌ Erreur Supabase OTP:', error);
        
        let errorMessage = "Impossible d'envoyer le code.";
        
        if (error.message.includes('rate limit') || error.status === 429) {
          errorMessage = "Trop de tentatives. Patientez 5 minutes avant de réessayer.";
        } else if (error.status === 500 || error.message.includes('sending') || error.message.includes('smtp') || error.message.includes('mail')) {
          errorMessage = "Le serveur n'a pas pu envoyer l'email. Réessayez plus tard ou utilisez la connexion par mot de passe.";
        } else if (error.message.includes('invalid') && error.message.includes('email')) {
          errorMessage = "Adresse email invalide. Vérifiez qu'elle est correcte.";
        }
        
        toast({
          title: "Erreur d'envoi",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      setEmail(userEmail);
      setStep('otp');
      
      toast({
        title: "Code envoyé !",
        description: "Consultez votre boîte email pour le code à 6 chiffres",
      });
      
      return true;
    } catch (error: any) {
      console.error('💥 Erreur générale:', error);
      toast({
        title: "Erreur",
        description: `Erreur technique: ${error.message}`,
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
        console.error('❌ Erreur vérification OTP:', error);
        toast({
          title: "Code invalide",
          description: "Code incorrect ou expiré. Demandez un nouveau code.",
          variant: "destructive"
        });
        return false;
      }

      if (data.user && data.session) {
        toast({
          title: "Connexion réussie !",
          description: "Redirection en cours...",
        });
        
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('💥 Erreur vérification:', error);
      toast({
        title: "Erreur",
        description: `Erreur de vérification: ${error.message}`,
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
