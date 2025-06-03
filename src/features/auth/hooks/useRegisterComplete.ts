
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";

export const useRegisterComplete = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🚀 Début inscription pour:", values.email);
      
      // Nettoyer l'état d'authentification existant
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log("Nettoyage préventif ignoré:", e);
      }

      // Formater le numéro de téléphone complet
      const fullPhoneNumber = `+33${values.phoneNumber.replace(/\D/g, '')}`;
      console.log("📞 Numéro formaté:", fullPhoneNumber);

      // Inscription Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate,
            phone_number: fullPhoneNumber,
            address: values.address,
            gender: values.gender,
          },
        }
      });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        throw error;
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        
        // Envoyer email via Resend
        try {
          console.log("📧 Envoi email de confirmation...");
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: values.email,
              type: 'confirmation',
              firstName: values.firstName,
              lastName: values.lastName
            }
          });

          if (emailError) {
            console.error("❌ Erreur email:", emailError);
          } else {
            console.log("✅ Email envoyé via Resend");
          }
        } catch (emailErr) {
          console.warn("⚠️ Erreur email (non bloquante):", emailErr);
        }

        // Envoyer SMS via Twilio
        try {
          console.log("📱 Envoi SMS de bienvenue...");
          const { data: smsData, error: smsError } = await supabase.functions.invoke('send-twilio-sms', {
            body: {
              phoneNumber: fullPhoneNumber,
              userId: data.user.id
            }
          });

          if (smsError) {
            console.error("❌ Erreur SMS:", smsError);
          } else {
            console.log("✅ SMS envoyé via Twilio");
          }
        } catch (smsErr) {
          console.warn("⚠️ Erreur SMS (non bloquante):", smsErr);
        }

        toast({
          title: "Inscription réussie !",
          description: "Vérifiez votre email pour confirmer votre compte. Un SMS de bienvenue a été envoyé.",
          duration: 8000
        });
        
        return { 
          success: true, 
          user: data.user, 
          needsEmailConfirmation: !data.user.email_confirmed_at,
          message: "Inscription réussie ! Vérifiez votre email pour activer votre compte."
        };
      }

      return { 
        success: false, 
        error: "Erreur inattendue",
        needsEmailConfirmation: false
      };
      
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);
      
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message?.includes('weak password')) {
        errorMessage = "Mot de passe trop faible. Utilisez au moins 8 caractères.";
      } else if (error.message?.includes('email')) {
        errorMessage = "Format d'email invalide.";
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
