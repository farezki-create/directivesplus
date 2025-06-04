
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";

export const useSimpleRegister = () => {
  const [isLoading, setIsLoading] = useState(false);

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🚀 Inscription simple avec Supabase Auth natif");
      console.log("📧 Email:", values.email);
      
      // Nettoyer complètement l'état d'authentification
      await supabase.auth.signOut();

      // Inscription avec confirmation email automatique
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

      if (error) {
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
        });
        
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log("✅ Utilisateur créé:", data.user.id);
        console.log("📧 Email confirmé automatiquement:", !!data.user.email_confirmed_at);
        
        if (!data.user.email_confirmed_at) {
          toast({
            title: "Inscription réussie !",
            description: "Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien pour activer votre compte.",
            duration: 8000
          });
          
          return { 
            success: true, 
            needsEmailConfirmation: true,
            message: "Vérifiez votre email pour confirmer votre inscription"
          };
        } else {
          toast({
            title: "Inscription réussie !",
            description: "Votre compte a été créé et activé. Vous pouvez maintenant vous connecter.",
          });
          
          return { 
            success: true, 
            needsEmailConfirmation: false,
            message: "Compte créé avec succès"
          };
        }
      }

      return { success: false, error: "Erreur inattendue" };
      
    } catch (error: any) {
      console.error("❌ Erreur globale:", error);
      
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
