
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";
import { performGlobalSignOut } from "@/utils/authUtils";
import { useSendOTP } from "@/hooks/useSendOTP";
import { generateOTP } from "@/utils/otpGenerator";

export const useRegisterWithConfirmation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useSendOTP();

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Début inscription avec confirmation email");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await performGlobalSignOut();

      // Générer un code OTP pour la confirmation
      const confirmationCode = generateOTP(6);
      console.log("🔢 Code OTP généré:", confirmationCode);

      // D'abord envoyer l'email de confirmation
      console.log("📧 Envoi de l'email de confirmation en cours...");
      
      const emailResult = await sendOTP({
        email: values.email,
        code: confirmationCode,
        firstName: values.firstName,
        lastName: values.lastName
      });

      if (!emailResult.success) {
        console.error("❌ Échec envoi email:", emailResult.error);
        toast({
          title: "Erreur d'envoi d'email",
          description: "Impossible d'envoyer l'email de confirmation. Veuillez vérifier votre adresse email.",
          variant: "destructive",
          duration: 8000
        });
        
        return { 
          success: false, 
          error: "Impossible d'envoyer l'email de confirmation",
          needsEmailConfirmation: false
        };
      }

      console.log("✅ Email de confirmation envoyé avec succès");

      // Ensuite créer l'utilisateur
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/rediger?confirmed=true`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate,
            phone_number: values.phoneNumber,
            address: values.address,
            gender: values.gender,
            confirmation_code: confirmationCode,
          },
        }
      });

      console.log("📝 Réponse Supabase signUp:", { data, error });

      if (error) {
        console.error("❌ Erreur d'inscription Supabase:", error);
        
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
        console.log("✅ Utilisateur créé avec succès:", data.user.id);
        
        toast({
          title: "Inscription réussie !",
          description: "Un email avec un code de confirmation a été envoyé à votre adresse.",
          duration: 6000
        });
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: true,
          confirmationCode,
          message: "Inscription réussie ! Un email de confirmation avec un code a été envoyé à votre adresse. Saisissez le code pour finaliser votre inscription."
        };
      }

      return { 
        success: false, 
        error: "Erreur inattendue lors de l'inscription",
        needsEmailConfirmation: false
      };
      
    } catch (error: any) {
      console.error("❌ Erreur globale lors de l'inscription:", error);
      
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
        duration: 8000
      });
      
      return { 
        success: false, 
        error: error.message || "Erreur inattendue",
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
