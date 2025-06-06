
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";
import { performGlobalSignOut } from "@/utils/authUtils";

export const useRegisterWithSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Inscription avec confirmation email Supabase");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await performGlobalSignOut();

      // Créer l'utilisateur avec confirmation email obligatoire
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/rediger`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate,
            phone_number: values.phoneNumber,
            address: values.address,
            gender: values.gender,
          },
        }
      });

      console.log("Réponse Supabase signUp:", { data, error });

      if (error) {
        console.error("❌ Erreur d'inscription:", error);
        
        let errorMessage = "Une erreur est survenue lors de l'inscription";
        
        if (error.message?.includes('already registered') || error.message?.includes('already been registered')) {
          errorMessage = "Cette adresse email est déjà utilisée. Essayez de vous connecter ou utilisez une autre adresse.";
        } else if (error.message?.includes('password')) {
          errorMessage = "Le mot de passe ne respecte pas les critères de sécurité requis.";
        } else if (error.message?.includes('email')) {
          errorMessage = "Format d'email invalide. Veuillez vérifier votre adresse email.";
        } else if (error.message?.includes('weak password')) {
          errorMessage = "Mot de passe trop faible. Utilisez au moins 8 caractères avec majuscules, minuscules et chiffres.";
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
          duration: 8000
        });
        
        return { 
          success: false, 
          error: errorMessage,
          needsEmailConfirmation: false
        };
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        console.log("Email confirmé:", !!data.user.email_confirmed_at);
        
        // Si l'email n'est pas confirmé, c'est normal - Supabase enverra automatiquement un email
        if (!data.user.email_confirmed_at) {
          console.log("📧 Email de confirmation envoyé automatiquement par Supabase");
          
          return { 
            success: true, 
            user: data.user, 
            needsEmailConfirmation: true,
            message: "Inscription réussie ! Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien pour finaliser votre inscription et accéder à votre espace."
          };
        } else {
          console.log("✅ Email déjà confirmé, inscription complète");
          
          return { 
            success: true, 
            user: data.user, 
            needsEmailConfirmation: false,
            message: "Compte créé et activé avec succès !"
          };
        }
      }

      return { 
        success: false, 
        error: "Erreur inattendue lors de l'inscription",
        needsEmailConfirmation: false
      };
      
    } catch (error: any) {
      console.error("❌ Erreur lors de l'inscription:", error);
      return { 
        success: false, 
        error: error.message,
        needsEmailConfirmation: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
