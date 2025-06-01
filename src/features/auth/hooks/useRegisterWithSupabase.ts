
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { RegisterFormValues } from "../schemas";
import { useCustomAuthFlow } from "./useCustomAuthFlow";

interface RegisterResult {
  success: boolean;
  message: string;
  needsEmailConfirmation: boolean;
  user?: any;
}

export const useRegisterWithSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUpWithCustomEmailFlow } = useCustomAuthFlow();

  const register = async (values: RegisterFormValues): Promise<RegisterResult> => {
    setIsLoading(true);
    
    try {
      console.log("🔐 Inscription avec système auth-hooks personnalisé");
      
      const result = await signUpWithCustomEmailFlow(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthDate,
        address: values.address,
        phone_number: values.phoneNumber
      });

      if (result.success) {
        return {
          success: true,
          message: result.needsEmailConfirmation 
            ? "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
            : "Inscription réussie ! Vous pouvez maintenant vous connecter.",
          needsEmailConfirmation: result.needsEmailConfirmation,
          user: result.user
        };
      } else {
        return {
          success: false,
          message: result.error || "Erreur lors de l'inscription",
          needsEmailConfirmation: false
        };
      }
      
    } catch (error: any) {
      console.error("💥 Erreur lors de l'inscription:", error);
      
      return {
        success: false,
        message: "Erreur technique lors de l'inscription",
        needsEmailConfirmation: false
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
