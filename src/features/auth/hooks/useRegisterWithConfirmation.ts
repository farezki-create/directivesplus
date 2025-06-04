
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
      console.log("🔐 Inscription avec envoi manuel d'email de confirmation");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await performGlobalSignOut();

      // Générer un code OTP pour la confirmation
      const confirmationCode = generateOTP(6);

      // Créer l'utilisateur avec confirmation email désactivée temporairement
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
        
        // Envoyer l'email de confirmation personnalisé
        try {
          console.log("📧 Envoi de l'email de confirmation personnalisé");
          
          const emailResult = await sendOTP({
            email: values.email,
            code: confirmationCode,
            firstName: values.firstName,
            lastName: values.lastName
          });

          if (emailResult.success) {
            console.log("✅ Email de confirmation envoyé avec succès");
            
            return { 
              success: true, 
              user: data.user, 
              needsEmailConfirmation: true,
              confirmationCode,
              message: "Inscription réussie ! Un email de confirmation avec un code a été envoyé à votre adresse. Saisissez le code pour finaliser votre inscription."
            };
          } else {
            throw new Error("Échec de l'envoi de l'email de confirmation");
          }
        } catch (emailError: any) {
          console.error("❌ Erreur envoi email:", emailError);
          
          // L'utilisateur est créé mais l'email n'a pas pu être envoyé
          toast({
            title: "Compte créé mais email non envoyé",
            description: "Votre compte a été créé mais l'email de confirmation n'a pas pu être envoyé. Contactez le support.",
            variant: "destructive",
            duration: 10000
          });
          
          return { 
            success: true, 
            user: data.user, 
            needsEmailConfirmation: true,
            error: "Email de confirmation non envoyé",
            message: "Compte créé mais email de confirmation non envoyé"
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
