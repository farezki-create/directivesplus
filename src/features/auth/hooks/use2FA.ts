
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const use2FA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting2FA, setIsWaiting2FA] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const sendTwoFactorCode = async (email: string, userId: string) => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Génération du code 2FA pour:", email);
      
      // Générer le code 2FA via la fonction Supabase
      const { data, error } = await supabase.rpc('generate_2fa_code', {
        p_email: email,
        p_user_id: userId,
        p_ip_address: null, // Vous pouvez ajouter la détection IP si nécessaire
        p_user_agent: navigator.userAgent
      });

      if (error) {
        console.error("❌ Erreur génération code 2FA:", error);
        throw error;
      }

      const code = data;
      console.log("✅ Code 2FA généré:", code);

      // Envoyer l'email avec le code
      const { error: emailError } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email: email,
          type: '2fa_code',
          code: code,
          user_data: { email }
        }
      });

      if (emailError) {
        console.error("❌ Erreur envoi email 2FA:", emailError);
        throw emailError;
      }

      console.log("📧 Email 2FA envoyé avec succès");
      
      setPendingEmail(email);
      setIsWaiting2FA(true);
      
      toast({
        title: "Code de sécurité envoyé",
        description: `Un code à 6 chiffres a été envoyé à ${email}. Il expire dans 10 minutes.`,
        duration: 8000
      });

      return { success: true };
      
    } catch (error: any) {
      console.error("❌ Erreur 2FA:", error);
      
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le code de sécurité",
        variant: "destructive"
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactorCode = async (code: string) => {
    if (!pendingEmail) {
      toast({
        title: "Erreur",
        description: "Aucune session 2FA en cours",
        variant: "destructive"
      });
      return { success: false };
    }

    setIsLoading(true);
    
    try {
      console.log("🔍 Vérification du code 2FA pour:", pendingEmail);
      
      // Vérifier le code via la fonction Supabase
      const { data, error } = await supabase.rpc('verify_2fa_code', {
        p_email: pendingEmail,
        p_code: code
      });

      if (error) {
        console.error("❌ Erreur vérification code 2FA:", error);
        throw error;
      }

      const result = data?.[0];
      
      if (result?.is_valid) {
        console.log("✅ Code 2FA valide pour l'utilisateur:", result.user_id);
        
        // Réinitialiser l'état 2FA
        setIsWaiting2FA(false);
        setPendingEmail(null);
        
        toast({
          title: "Connexion réussie !",
          description: "Code de sécurité validé. Redirection en cours...",
          duration: 3000
        });
        
        return { success: true, userId: result.user_id };
      } else {
        console.log("❌ Code 2FA invalide ou expiré");
        
        toast({
          title: "Code invalide",
          description: "Le code saisi est incorrect ou a expiré. Veuillez réessayer.",
          variant: "destructive"
        });
        
        return { success: false };
      }
      
    } catch (error: any) {
      console.error("❌ Erreur vérification 2FA:", error);
      
      toast({
        title: "Erreur de vérification",
        description: error.message || "Impossible de vérifier le code",
        variant: "destructive"
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const reset2FA = () => {
    setIsWaiting2FA(false);
    setPendingEmail(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    isWaiting2FA,
    pendingEmail,
    sendTwoFactorCode,
    verifyTwoFactorCode,
    reset2FA
  };
};
