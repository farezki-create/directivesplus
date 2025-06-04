
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SendOTPParams {
  email: string;
  code: string;
  firstName?: string;
  lastName?: string;
}

export const useSendOTP = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async ({ email, code, firstName, lastName }: SendOTPParams) => {
    setIsLoading(true);
    
    try {
      console.log("📧 Préparation envoi du code OTP");
      console.log("Destinataire:", email);
      console.log("Code:", code);
      console.log("Nom/Prénom:", firstName, lastName);
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: email.trim(),
          code: code.trim(),
          firstName: firstName?.trim(),
          lastName: lastName?.trim()
        }
      });

      console.log("🔍 Réponse complète Edge Function:", { data, error });

      if (error) {
        console.error("❌ Erreur Edge Function:", error);
        throw new Error(error.message || "Erreur lors de l'appel à l'Edge Function");
      }

      if (data && data.success) {
        console.log("✅ Code OTP envoyé avec succès");
        console.log("Message ID:", data.messageId);
        
        return { 
          success: true, 
          messageId: data.messageId,
          message: data.message || "Code envoyé avec succès"
        };
      } else {
        console.error("❌ Réponse d'échec de l'Edge Function:", data);
        throw new Error(data?.error || "Erreur inconnue lors de l'envoi du code");
      }
      
    } catch (error: any) {
      console.error("❌ Erreur complète lors de l'envoi du code OTP:", error);
      
      return { 
        success: false, 
        error: error.message || "Erreur lors de l'envoi du code"
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOTP,
    isLoading,
  };
};
