
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";

export const useRegisterWithSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Inscription avec Supabase standard");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer toute session existante
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log("Nettoyage préventif ignoré:", e);
      }

      // Configuration explicite de l'URL de redirection
      const redirectUrl = `${window.location.origin}/auth?confirmed=true`;
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

      if (data.user && !data.user.email_confirmed_at) {
        console.log("📧 Email de confirmation requis pour:", data.user.email);
        console.log("Confirmation sent at:", data.user.confirmation_sent_at);
        
        // Appeler directement notre Edge Function Brevo pour envoyer l'email
        try {
          console.log("🚀 Envoi direct via Edge Function Brevo...");
          
          const { data: brevoResult, error: brevoError } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: values.email,
              type: 'signup',
              confirmation_url: redirectUrl,
              user_data: {
                first_name: values.firstName,
                last_name: values.lastName
              }
            }
          });

          if (brevoError) {
            console.error("❌ Erreur Edge Function Brevo:", brevoError);
            console.log("⚠️ Supabase dit avoir envoyé l'email, mais notre Edge Function a échoué");
          } else {
            console.log("✅ Edge Function Brevo réussie:", brevoResult);
          }
          
        } catch (brevoErr) {
          console.error("💥 Erreur lors de l'appel Edge Function:", brevoErr);
        }
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: true,
          message: "Inscription réussie ! Un email de confirmation a été envoyé à votre adresse."
        };
      } else if (data.user?.email_confirmed_at) {
        console.log("✅ Email déjà confirmé, inscription complète");
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: false,
          message: "Compte créé et activé avec succès !"
        };
      }

      return { 
        success: true, 
        user: data.user,
        needsEmailConfirmation: false,
        message: "Inscription réussie !"
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
