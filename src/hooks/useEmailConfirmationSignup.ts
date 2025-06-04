
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { generateOTP } from "@/utils/otpGenerator";
import { useOTPEmailSender } from "./useOTPEmailSender";
import { useSupabaseSignup } from "./useSupabaseSignup";
import { RegisterFormValues } from "@/features/auth/schemas";

interface SignupResult {
  success: boolean;
  needsEmailConfirmation: boolean;
  confirmationCode?: string;
  user?: any;
  error?: string;
}

export const useEmailConfirmationSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useOTPEmailSender();
  const { signUp: supabaseSignUp } = useSupabaseSignup();

  const signUp = async (formData: RegisterFormValues): Promise<SignupResult> => {
    setIsLoading(true);
    
    console.log("🔍 === DEBUG EMAIL CONFIRMATION SIGNUP ===");
    console.log("📧 Email REÇU dans signUp:", `"${formData.email}"`);
    console.log("📧 Type:", typeof formData.email);
    console.log("📧 Données complètes:", {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName
    });
    
    try {
      // Étape 1: Générer le code OTP
      const confirmationCode = generateOTP(6);
      console.log("🔢 Code généré:", confirmationCode);

      // Étape 2: Envoyer l'email de confirmation
      console.log("📧 === ENVOI EMAIL ===");
      console.log("📧 Email qui sera envoyé à sendOTP:", `"${formData.email}"`);
      
      const emailResult = await sendOTP(
        formData.email,
        confirmationCode,
        formData.firstName,
        formData.lastName
      );

      if (!emailResult.success) {
        console.error("❌ Échec envoi email:", emailResult.error);
        toast({
          title: "Erreur d'envoi d'email",
          description: emailResult.error || "Impossible d'envoyer l'email de confirmation",
          variant: "destructive",
        });
        return { 
          success: false, 
          needsEmailConfirmation: false,
          error: emailResult.error 
        };
      }

      console.log("✅ Email envoyé avec succès");

      // Étape 3: Créer l'utilisateur Supabase
      console.log("🔐 === CRÉATION UTILISATEUR ===");
      console.log("📧 Email qui sera envoyé à supabaseSignUp:", `"${formData.email}"`);
      
      const signupResult = await supabaseSignUp({
        ...formData,
        confirmationCode
      });

      if (!signupResult.success) {
        console.error("❌ Échec création utilisateur:", signupResult.error);
        toast({
          title: "Erreur d'inscription",
          description: signupResult.error || "Erreur lors de la création du compte",
          variant: "destructive",
        });
        return { 
          success: false, 
          needsEmailConfirmation: false,
          error: signupResult.error 
        };
      }

      console.log("✅ Processus d'inscription terminé avec succès");
      console.log("📧 Email final dans le résultat:", `"${formData.email}"`);
      
      toast({
        title: "Inscription réussie !",
        description: `Un email avec un code de confirmation a été envoyé à ${formData.email}`,
        duration: 6000
      });

      return {
        success: true,
        needsEmailConfirmation: true,
        confirmationCode,
        user: signupResult.user
      };

    } catch (error: any) {
      console.error("❌ Erreur globale:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      
      return { 
        success: false, 
        needsEmailConfirmation: false,
        error: error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
