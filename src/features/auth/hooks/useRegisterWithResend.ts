
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";
import { performGlobalSignOut } from "@/utils/authUtils";

export const useRegisterWithResend = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Inscription avec Resend + Twilio");
      console.log("Email à inscrire:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await performGlobalSignOut();

      // Créer l'utilisateur SANS confirmation automatique
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
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
        
        // Générer un token de confirmation personnalisé
        const confirmationToken = `${data.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Envoyer l'email de confirmation via Resend
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-auth-email', {
            body: {
              email: values.email,
              type: 'confirmation',
              token: confirmationToken,
              firstName: values.firstName,
              lastName: values.lastName
            }
          });

          if (emailError) throw emailError;

          if (emailData.success) {
            console.log("📧 Email de confirmation envoyé via Resend");
            
            // Stocker le token temporairement (en production, utiliser la base de données)
            localStorage.setItem(`confirmation_${confirmationToken}`, JSON.stringify({
              userId: data.user.id,
              email: values.email,
              expires: Date.now() + (24 * 60 * 60 * 1000) // 24h
            }));
            
            return { 
              success: true, 
              user: data.user, 
              needsEmailConfirmation: true,
              confirmationToken,
              message: "Inscription réussie ! Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien pour continuer vers la vérification SMS."
            };
          } else {
            throw new Error(emailData.error || "Erreur lors de l'envoi de l'email");
          }
        } catch (emailError: any) {
          console.error("❌ Erreur envoi email:", emailError);
          
          // Supprimer l'utilisateur si l'email n'a pas pu être envoyé
          await supabase.auth.admin.deleteUser(data.user.id);
          
          toast({
            title: "Erreur d'envoi d'email",
            description: "Impossible d'envoyer l'email de confirmation. Veuillez réessayer.",
            variant: "destructive"
          });
          
          return { 
            success: false, 
            error: "Impossible d'envoyer l'email de confirmation",
            needsEmailConfirmation: false
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
