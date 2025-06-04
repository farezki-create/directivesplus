
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SendOTPResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

export const useOTPEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async (
    email: string,
    code: string,
    firstName?: string,
    lastName?: string
  ): Promise<SendOTPResult> => {
    setIsLoading(true);
    
    console.log("🔍 === ENVOI OTP DEBUG ===");
    console.log("📧 Email EXACT reçu:", `"${email}"`);
    console.log("🔢 Code:", code);
    console.log("👤 Prénom:", firstName, "Nom:", lastName);
    
    try {
      if (!email || email.trim().length === 0) {
        throw new Error("Email vide ou invalide");
      }
      
      const cleanEmail = email.trim();
      console.log("📧 Email nettoyé FINAL:", `"${cleanEmail}"`);
      
      const requestBody = {
        email: cleanEmail,
        code: code.trim(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim()
      };
      
      console.log("📤 Body de la requête:", requestBody);
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: requestBody
      });

      console.log("📥 Réponse Edge Function:", { data, error });

      if (error) {
        console.error("❌ Erreur Edge Function:", error);
        return { success: false, error: error.message };
      }

      if (data?.success) {
        console.log("✅ Email OTP envoyé avec succès à:", cleanEmail);
        return { 
          success: true, 
          messageId: data.messageId,
        };
      } else {
        console.error("❌ Échec Edge Function:", data);
        return { success: false, error: data?.error || "Erreur inconnue" };
      }
      
    } catch (error: any) {
      console.error("❌ Erreur complète envoi OTP:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendOTP, isLoading };
};
