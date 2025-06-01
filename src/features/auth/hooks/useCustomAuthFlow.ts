
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useCustomAuthFlow = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUpWithCustomEmailFlow = async (email: string, password: string, userData: any) => {
    setIsLoading(true);
    
    try {
      console.log("🎯 Inscription avec flux email custom via auth-hooks");
      
      // Inscription avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: userData
        }
      });

      if (error) {
        console.error("❌ Erreur Supabase Auth:", error);
        throw error;
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        
        // Déclencher manuellement notre hook si nécessaire
        try {
          console.log("🚀 Déclenchement manuel du hook auth-hooks...");
          const { data: hookData, error: hookError } = await supabase.functions.invoke('auth-hooks', {
            body: {
              type: 'INSERT',
              table: 'users',
              record: data.user,
              schema: 'auth'
            }
          });

          if (hookError) {
            console.warn("⚠️ Erreur hook (non critique):", hookError);
          } else {
            console.log("✅ Hook exécuté:", hookData);
          }
        } catch (hookError) {
          console.warn("⚠️ Erreur hook (non critique):", hookError);
          // Ne pas faire échouer l'inscription pour une erreur de hook
        }

        toast({
          title: "Inscription réussie !",
          description: "Un email de confirmation a été envoyé via notre système Brevo. Consultez votre boîte de réception.",
          duration: 8000
        });

        return {
          success: true,
          needsEmailConfirmation: !data.user.email_confirmed_at,
          user: data.user
        };
      }

      return {
        success: false,
        needsEmailConfirmation: false,
        error: "Erreur inconnue lors de l'inscription"
      };

    } catch (error: any) {
      console.error("💥 Erreur inscription custom:", error);
      
      let errorMessage = "Erreur lors de l'inscription";
      
      if (error.message?.includes("email") && error.message?.includes("already")) {
        errorMessage = "Cette adresse email est déjà utilisée";
      } else if (error.message?.includes("password")) {
        errorMessage = "Le mot de passe ne respecte pas les critères requis";
      }

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
        duration: 6000
      });

      return {
        success: false,
        needsEmailConfirmation: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordWithCustomFlow = async (email: string) => {
    setIsLoading(true);
    
    try {
      console.log("🔑 Reset password avec flux custom");
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email de réinitialisation envoyé",
        description: "Un email pour réinitialiser votre mot de passe a été envoyé via Brevo.",
        duration: 6000
      });

      return { success: true };

    } catch (error: any) {
      console.error("❌ Erreur reset password:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation.",
        variant: "destructive",
        duration: 6000
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUpWithCustomEmailFlow,
    resetPasswordWithCustomFlow,
    isLoading
  };
};
