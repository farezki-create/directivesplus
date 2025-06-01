
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegisterFormValues } from "../schemas";

interface RegisterResult {
  success: boolean;
  message: string;
  needsEmailConfirmation: boolean;
  user?: any;
}

export const useRegisterWithSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: RegisterFormValues): Promise<RegisterResult> => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Inscription avec Supabase standard");
      
      // Inscription avec Supabase Auth standard
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate,
            address: values.address,
            phone_number: values.phoneNumber
          }
        }
      });

      if (error) {
        console.error("❌ Erreur Supabase Auth:", error);
        
        let errorMessage = "Erreur lors de l'inscription";
        
        if (error.message?.includes("email") && error.message?.includes("already")) {
          errorMessage = "Cette adresse email est déjà utilisée";
        } else if (error.message?.includes("password")) {
          errorMessage = "Le mot de passe ne respecte pas les critères requis";
        } else if (error.message?.includes("rate limit") || error.message?.includes("email_send_rate_limit")) {
          errorMessage = "Trop de tentatives d'envoi d'email. Veuillez attendre quelques minutes avant de réessayer.";
        }
        
        return {
          success: false,
          message: errorMessage,
          needsEmailConfirmation: false
        };
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        
        const needsConfirmation = !data.user.email_confirmed_at;
        
        return {
          success: true,
          message: needsConfirmation 
            ? "Inscription réussie ! Un email de confirmation a été envoyé à votre adresse."
            : "Inscription réussie ! Vous pouvez maintenant vous connecter.",
          needsEmailConfirmation: needsConfirmation,
          user: data.user
        };
      }

      return {
        success: false,
        message: "Erreur inconnue lors de l'inscription",
        needsEmailConfirmation: false
      };

    } catch (error: any) {
      console.error("💥 Erreur inscription:", error);
      
      return {
        success: false,
        message: "Erreur technique lors de l'inscription",
        needsEmailConfirmation: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
