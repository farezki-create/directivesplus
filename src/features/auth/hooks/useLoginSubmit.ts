
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoginFormValues } from "../schemas";

interface UseLoginSubmitProps {
  redirectPath: string;
  setRedirectInProgress: (value: boolean) => void;
  onSuccessfulLogin: (email: string) => void;
}

export const useLoginSubmit = ({
  redirectPath,
  setRedirectInProgress,
  onSuccessfulLogin
}: UseLoginSubmitProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Messages d'erreur génériques pour éviter l'énumération d'utilisateurs
        let errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Trop de tentatives de connexion. Veuillez patienter avant de réessayer.";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
          duration: 6000
        });
        
        throw error;
      }
      
      if (data.user) {
        console.log("Sign in successful, user:", data.user.id);
        
        // Réinitialiser les compteurs après succès
        onSuccessfulLogin(values.email);
        
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté.",
        });
        
        setRedirectInProgress(true);
        
        // Redirection avec délai pour permettre la propagation de l'état
        setTimeout(() => {
          const finalRedirectPath = redirectPath === "/dashboard" ? "/rediger" : redirectPath;
          console.log("Redirecting to:", finalRedirectPath);
          window.location.href = finalRedirectPath;
        }, 500);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
