
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoginFormValues } from "../schemas";

interface UseLoginWith2FAProps {
  onSuccessfulLogin: (email: string) => void;
  setRedirectInProgress: (value: boolean) => void;
}

export const useLoginWith2FA = ({
  onSuccessfulLogin,
  setRedirectInProgress
}: UseLoginWith2FAProps) => {
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const handleInitialLogin = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      console.log("🔐 Tentative de connexion pour:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("❌ Erreur de connexion:", error);
        
        let errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception.";
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
        console.log("✅ Connexion initiale réussie, vérification 2FA...");
        
        // For demo purposes, we'll require 2FA for all users
        // In production, you'd check user preferences or security requirements
        setPendingUserId(data.user.id);
        setRequiresTwoFactor(true);
        
        // Sign out temporarily until 2FA is complete
        await supabase.auth.signOut();
      }
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeTwoFactorAuth = async () => {
    if (!pendingUserId) return;
    
    try {
      console.log("✅ 2FA validée, finalisation de la connexion...");
      
      onSuccessfulLogin("user@example.com"); // In production, use actual email
      
      toast({
        title: "Connexion réussie !",
        description: "Authentification à deux facteurs validée",
        duration: 3000
      });
      
      setRedirectInProgress(true);
      
      setTimeout(() => {
        console.log("🚀 Redirection vers /rediger");
        window.location.href = "/rediger";
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
  };

  return {
    loading,
    requiresTwoFactor,
    pendingUserId,
    handleInitialLogin,
    completeTwoFactorAuth,
    resetTwoFactor
  };
};
