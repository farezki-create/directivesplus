
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
      console.log("🔐 Tentative de connexion pour:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("❌ Erreur de connexion:", error);
        
        let errorMessage = "Identifiants incorrects. Vérifiez votre email et mot de passe.";
        let showEmailConfirmationHint = false;
        
        if (error.message.includes("Email not confirmed") || error.message.includes("email_not_confirmed")) {
          errorMessage = "Votre email n'a pas encore été vérifié. Consultez votre boîte de réception et cliquez sur le lien de confirmation.";
          showEmailConfirmationHint = true;
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos informations.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Trop de tentatives de connexion. Veuillez patienter avant de réessayer.";
        } else if (error.message.includes("signup disabled")) {
          errorMessage = "Les inscriptions sont temporairement désactivées.";
        }
        
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
          duration: showEmailConfirmationHint ? 10000 : 6000
        });
        
        if (showEmailConfirmationHint) {
          setTimeout(() => {
            toast({
              title: "Besoin d'aide ?",
              description: "Si vous ne trouvez pas l'email de confirmation, vérifiez vos spams ou contactez le support.",
              duration: 8000
            });
          }, 2000);
        }
        
        throw error;
      }
      
      if (data.user) {
        console.log("✅ Connexion réussie pour l'utilisateur:", data.user.id);
        
        if (!data.user.email_confirmed_at) {
          console.warn("⚠️ Email non confirmé pour l'utilisateur connecté");
          
          toast({
            title: "Email non confirmé",
            description: "Votre email n'est pas encore confirmé. Consultez votre boîte de réception.",
            variant: "destructive",
            duration: 8000
          });
          
          await supabase.auth.signOut();
          return;
        }
        
        onSuccessfulLogin(values.email);
        
        toast({
          title: "Connexion réussie !",
          description: "Redirection vers votre espace personnel...",
          duration: 3000
        });
        
        setRedirectInProgress(true);
        
        setTimeout(() => {
          const finalRedirectPath = redirectPath === "/dashboard" ? "/rediger" : redirectPath;
          console.log("🚀 Redirection vers:", finalRedirectPath);
          window.location.href = finalRedirectPath;
        }, 1000);
      }
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
