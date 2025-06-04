
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { performGlobalSignOut } from "@/utils/authUtils";
import { RegisterFormValues } from "@/features/auth/schemas";

interface SignupData extends RegisterFormValues {
  confirmationCode: string;
}

interface SignupResult {
  success: boolean;
  user?: any;
  error?: string;
}

export const useSupabaseSignup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (data: SignupData): Promise<SignupResult> => {
    setIsLoading(true);
    
    console.log("🔐 === INSCRIPTION SUPABASE ===");
    console.log("📧 Email pour inscription:", `"${data.email}"`);
    
    try {
      // Nettoyer l'état d'authentification
      await performGlobalSignOut();

      const { data: result, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/rediger?confirmed=true`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            birth_date: data.birthDate,
            phone_number: data.phoneNumber,
            address: data.address || "",
            gender: data.gender || "",
            confirmation_code: data.confirmationCode,
          },
        }
      });

      console.log("📝 Réponse Supabase:", { result, error });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        return { success: false, error: error.message };
      }

      if (result.user) {
        console.log("✅ Utilisateur créé:", result.user.id);
        return { success: true, user: result.user };
      }

      return { success: false, error: "Erreur inattendue" };
      
    } catch (error: any) {
      console.error("❌ Erreur inscription:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
