
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
      console.log("🔐 Inscription avec Auth Hook automatique");
      
      // Inscription directe avec Supabase Auth
      // Le webhook auth-hooks se déclenchera automatiquement
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
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
        }

        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
          duration: 6000
        });

        return {
          success: false,
          message: errorMessage,
          needsEmailConfirmation: false
        };
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        
        toast({
          title: "Inscription réussie !",
          description: "Un email de confirmation a été envoyé. Consultez votre boîte de réception.",
          duration: 8000
        });

        return {
          success: true,
          message: data.user.email_confirmed_at 
            ? "Inscription réussie ! Vous pouvez maintenant vous connecter."
            : "Inscription réussie ! Vérifiez votre email pour confirmer votre compte.",
          needsEmailConfirmation: !data.user.email_confirmed_at,
          user: data.user
        };
      }

      return {
        success: false,
        message: "Erreur inconnue lors de l'inscription",
        needsEmailConfirmation: false
      };

    } catch (error: any) {
      console.error("💥 Erreur lors de l'inscription:", error);
      
      toast({
        title: "Erreur technique",
        description: "Une erreur technique s'est produite lors de l'inscription",
        variant: "destructive",
        duration: 6000
      });
      
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
