
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegisterFormValues } from "../schemas";

export const useSimpleRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: RegisterFormValues) => {
    setIsLoading(true);
    console.log("🔐 Début inscription simple pour:", values.email);

    try {
      // Configuration de l'URL de redirection pour la confirmation
      const redirectUrl = `${window.location.origin}/email-confirmation`;
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            gender: values.gender,
            birth_date: values.birthDate,
            address: values.address,
            phone_number: values.phoneNumber,
          }
        }
      });

      if (error) {
        console.error("❌ Erreur inscription:", error);
        
        let errorMessage = "Erreur lors de l'inscription";
        if (error.message.includes("already")) {
          errorMessage = "Un compte existe déjà avec cet email";
        } else if (error.message.includes("password")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        } else if (error.message.includes("email")) {
          errorMessage = "Format d'email invalide";
        }

        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        });

        return { success: false, message: errorMessage, needsEmailConfirmation: false };
      }

      console.log("✅ Inscription réussie:", data);

      const needsConfirmation = !data.user?.email_confirmed_at;
      
      if (needsConfirmation) {
        toast({
          title: "Inscription réussie !",
          description: "Un email de confirmation a été envoyé. Vérifiez votre boîte de réception.",
          duration: 5000,
        });
        
        return { 
          success: true, 
          message: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte.",
          needsEmailConfirmation: true 
        };
      } else {
        toast({
          title: "Inscription réussie !",
          description: "Vous pouvez maintenant vous connecter.",
        });
        
        return { 
          success: true, 
          message: "Inscription réussie ! Vous pouvez maintenant vous connecter.",
          needsEmailConfirmation: false 
        };
      }

    } catch (error: any) {
      console.error("💥 Erreur inattendue:", error);
      
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });

      return { success: false, message: "Erreur inattendue", needsEmailConfirmation: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
