
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
      console.log('🔄 Tentative d\'envoi OTP pour:', userEmail);
      
      // Nettoyer d'abord toute session existante
      await supabase.auth.signOut({ scope: 'global' });
      
      // Utiliser signInWithOtp avec des options plus permissives
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userEmail.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      console.log('📧 Réponse Supabase OTP:', { data, error });

      if (error) {
        console.error('❌ Erreur Supabase OTP:', error);
        
        // Diagnostic détaillé de l'erreur
        let errorMessage = "Impossible d'envoyer le code.";
        
        if (error.message.includes('rate limit') || error.status === 429) {
          errorMessage = "Trop de tentatives. Patientez 5 minutes avant de réessayer.";
        } else if (error.message.includes('email')) {
          errorMessage = "Problème avec l'adresse email. Vérifiez qu'elle est correcte.";
        } else if (error.message.includes('smtp') || error.message.includes('mail')) {
          errorMessage = "Problème de configuration email. Contactez l'administrateur.";
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
      console.log('🔍 Vérification OTP pour:', email);
      
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode,
        type: 'email'
      });

      console.log('✅ Réponse vérification OTP:', { data, error });

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
        console.log('🎉 Connexion réussie pour:', data.user.email);
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
