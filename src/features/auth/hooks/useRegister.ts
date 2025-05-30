
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🚀 Début du processus d'inscription pour:", values.email);
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log("Nettoyage préventif ignoré:", e);
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
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
        
        throw error;
      }

      console.log("✅ Inscription API réussie:", {
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at,
        needsVerification: !data.user?.email_confirmed_at
      });

      if (data.user && !data.user.email_confirmed_at) {
        console.log("📧 Email de confirmation requis");
        
        toast({
          title: "Inscription réussie !",
          description: "Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte.",
          duration: 10000
        });
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: true,
          message: "Email de confirmation envoyé"
        };
      } else if (data.user?.email_confirmed_at) {
        console.log("✅ Email déjà confirmé, inscription complète");
        
        toast({
          title: "Inscription réussie !",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
          duration: 6000
        });
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: false,
          message: "Compte créé et activé"
        };
      }

      return { success: true, user: data.user };
      
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
