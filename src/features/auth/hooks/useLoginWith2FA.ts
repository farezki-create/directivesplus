
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoginFormValues } from "../schemas";
import { use2FA } from "./use2FA";

interface UseLoginWith2FAProps {
  onSuccessfulLogin: (email: string) => void;
  setRedirectInProgress: (value: boolean) => void;
  redirectPath: string;
}

export const useLoginWith2FA = ({
  onSuccessfulLogin,
  setRedirectInProgress,
  redirectPath
}: UseLoginWith2FAProps) => {
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  
  const { sendTwoFactorCode, reset2FA } = use2FA();

  const handleInitialLogin = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      console.log("🔐 Tentative de connexion avec 2FA pour:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("❌ Erreur de connexion:", error);
        
        let errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception pour confirmer votre compte.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect.";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive"
        });
        
        throw error;
      }
      
      if (data.user) {
        console.log("✅ Connexion initiale réussie, vérification statut email...");
        
        // Vérifier si l'email est confirmé
        if (!data.user.email_confirmed_at) {
          console.log("📧 Email non confirmé, déconnexion et message d'erreur...");
          
          // Déconnecter l'utilisateur
          await supabase.auth.signOut();
          
          toast({
            title: "Email non confirmé",
            description: "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception pour confirmer votre compte.",
            variant: "destructive"
          });
          
          setLoading(false);
          return;
        }
        
        console.log("✅ Email confirmé, envoi du code 2FA...");
        
        // Stocker les informations pour la 2FA AVANT de déconnecter
        setPendingUserId(data.user.id);
        setPendingEmail(values.email);
        
        // Envoyer le code 2FA AVANT de déconnecter
        const result = await sendTwoFactorCode(values.email, data.user.id);
        
        if (result.success) {
          console.log("✅ Code 2FA envoyé, déconnexion temporaire...");
          
          // Déconnecter temporairement APRÈS envoi du code
          await supabase.auth.signOut();
          
          setRequiresTwoFactor(true);
        } else {
          // Si l'envoi échoue, nettoyer et afficher l'erreur
          await supabase.auth.signOut();
          throw new Error("Impossible d'envoyer le code 2FA");
        }
      }
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la connexion:", error);
      resetTwoFactor();
    } finally {
      setLoading(false);
    }
  };

  const completeTwoFactorAuth = async () => {
    if (!pendingEmail) return;
    
    try {
      console.log("✅ 2FA validée, finalisation de la connexion...");
      
      // Marquer comme réussi
      onSuccessfulLogin(pendingEmail);
      
      toast({
        title: "Connexion réussie !",
        description: "Authentification à deux facteurs validée",
        duration: 3000
      });
      
      setRedirectInProgress(true);
      
      // Réinitialiser l'état 2FA
      resetTwoFactor();
      
      setTimeout(() => {
        console.log(`🚀 Redirection vers ${redirectPath}`);
        window.location.href = redirectPath;
      }, 1000);
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la finalisation:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la finalisation de la connexion",
        variant: "destructive"
      });
    }
  };

  const resetTwoFactor = () => {
    setRequiresTwoFactor(false);
    setPendingUserId(null);
    setPendingEmail(null);
    reset2FA();
  };

  return {
    loading,
    requiresTwoFactor,
    pendingUserId,
    pendingEmail,
    handleInitialLogin,
    completeTwoFactorAuth,
    resetTwoFactor
  };
};
