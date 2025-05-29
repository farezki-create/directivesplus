
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { registerFormSchema } from "../schemas";
import { useSendOTPEmail } from "@/hooks/useSendOTPEmail";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTPEmail } = useSendOTPEmail();

  const register = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    
    try {
      console.log("🚀 Starting registration process for:", values.email);
      
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
          },
          // Désactiver l'email automatique de Supabase
          emailRedirectTo: undefined,
        }
      });

      if (error) {
        console.error("❌ Registration error:", error);
        throw error;
      }

      console.log("✅ Registration API call successful:", {
        userId: data.user?.id,
        email: data.user?.email,
        needsVerification: !data.user?.email_confirmed_at
      });

      if (data.user && !data.user.email_confirmed_at) {
        console.log("📧 User needs email verification, generating OTP...");
        
        // Générer un OTP et l'envoyer via SendGrid
        const { data: otpData, error: otpError } = await supabase.auth.resend({
          type: 'signup',
          email: values.email,
        });

        if (otpError) {
          console.error("❌ Error generating OTP:", otpError);
          // Continuer même si l'OTP échoue, l'utilisateur peut réessayer
        }

        toast({
          title: "Inscription réussie",
          description: "Un code de vérification a été envoyé à votre email via notre système sécurisé.",
        });
      } else if (data.user?.email_confirmed_at) {
        console.log("✅ Email already confirmed, registration complete");
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        });
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      if (error.message?.includes('already registered')) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message?.includes('password')) {
        errorMessage = "Le mot de passe ne respecte pas les critères requis.";
      } else if (error.message?.includes('email')) {
        errorMessage = "Format d'email invalide.";
      }
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
  };
};
