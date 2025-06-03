
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
      console.log("🔐 Inscription avec confirmation email obligatoire");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await performGlobalSignOut();

      // Configuration de l'URL de redirection vers la page 2FA
      const redirectUrl = `${window.location.origin}/auth/2fa?email_confirmed=true`;
      console.log("URL de redirection configurée:", redirectUrl);

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: redirectUrl,
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

      console.log("✅ Utilisateur créé:", data.user?.id);
      console.log("Email confirmé automatiquement:", !!data.user?.email_confirmed_at);

      if (data.user && !data.user.email_confirmed_at) {
        console.log("📧 Email de confirmation requis - envoi via Brevo");
        
        // L'URL de confirmation redirigera directement vers /auth/2fa avec l'ID utilisateur
        const confirmationUrl = `${redirectUrl}&user_id=${data.user.id}`;
        
        // Appeler notre Edge Function Brevo pour envoyer l'email de confirmation
        try {
          console.log("🚀 Envoi email de confirmation via Brevo...");
          
          const { data: brevoResult, error: brevoError } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: values.email,
              type: 'signup',
              confirmation_url: confirmationUrl,
              user_data: {
                first_name: values.firstName,
                last_name: values.lastName
              }
            }
          });

          if (brevoError) {
            console.error("❌ Erreur Edge Function Brevo:", brevoError);
          } else {
            console.log("✅ Email de confirmation envoyé via Brevo:", brevoResult);
          }
          
        } catch (brevoErr) {
          console.error("💥 Erreur lors de l'appel Edge Function:", brevoErr);
        }
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: true,
          message: "Inscription réussie ! Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien pour continuer vers la vérification par SMS."
        };
      } else if (data.user?.email_confirmed_at) {
        console.log("✅ Email déjà confirmé, redirection vers 2FA");
        
        // Rediriger directement vers la page 2FA
        window.location.href = `/auth/2fa?user_id=${data.user.id}&email_confirmed=true`;
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: false,
          message: "Compte créé avec succès ! Redirection vers la vérification par SMS..."
        };
      }

      return { 
        success: true, 
        user: data.user,
        needsEmailConfirmation: true,
        message: "Inscription en cours de validation."
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
