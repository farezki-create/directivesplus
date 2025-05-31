
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useResendEmail } from "@/hooks/useResendEmail";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";

export const useRegisterWithCustomEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { sendEmail } = useResendEmail();

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🚀 Début du processus d'inscription avec email personnalisé pour:", values.email);
      
      // Nettoyage préventif de la session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.log("Nettoyage préventif ignoré:", e);
      }

      // Inscription sans confirmation automatique
      console.log("📝 Tentative d'inscription Supabase...");
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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

      console.log("📊 Résultat inscription:", {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        error: error?.message
      });

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
          error: error.message,
          needsEmailConfirmation: false
        };
      }

      console.log("✅ Inscription API réussie:", {
        userId: data.user?.id,
        email: data.user?.email,
        emailConfirmed: !!data.user?.email_confirmed_at
      });

      // Vérifier si l'email est déjà confirmé
      if (data.user?.email_confirmed_at) {
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

      // Email non confirmé, envoyer un email personnalisé
      if (data.user && !data.user.email_confirmed_at) {
        console.log("📧 Envoi d'email de confirmation personnalisé");
        
        // Créer l'URL de confirmation
        const confirmationUrl = `${window.location.origin}/auth?type=signup&email=${encodeURIComponent(values.email)}`;
        
        // Envoyer l'email de confirmation personnalisé
        const emailResult = await sendEmail({
          to: values.email,
          subject: "Confirmez votre inscription à DirectivesPlus",
          type: 'confirmation',
          confirmationUrl: confirmationUrl,
          userName: `${values.firstName} ${values.lastName}`
        });
        
        console.log("📬 Résultat envoi email:", emailResult);
        
        if (emailResult.success) {
          toast({
            title: "Inscription réussie !",
            description: "Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte.",
            duration: 10000
          });
          
          return { 
            success: true, 
            user: data.user, 
            needsEmailConfirmation: true,
            message: "Email de confirmation personnalisé envoyé"
          };
        } else {
          console.warn("⚠️ Échec de l'envoi d'email personnalisé");
          
          // Même en cas d'échec d'envoi, l'inscription a réussi
          toast({
            title: "Inscription réussie !",
            description: "Votre compte a été créé. Vérifiez votre boîte email pour le lien de confirmation.",
            duration: 10000
          });
          
          return { 
            success: true, 
            user: data.user, 
            needsEmailConfirmation: true,
            message: "Inscription réussie, vérification email en attente"
          };
        }
      }

      return { success: true, user: data.user };
      
    } catch (error: any) {
      console.error("💥 Erreur lors de l'inscription:", error);
      
      toast({
        title: "Erreur technique",
        description: "Une erreur technique est survenue. Veuillez réessayer.",
        variant: "destructive",
        duration: 8000
      });
      
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
