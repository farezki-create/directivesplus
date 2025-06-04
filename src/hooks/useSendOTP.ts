
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
      console.log("📧 Envoi du code OTP:", { email: email.substring(0, 3) + "****", codeLength: code.length });
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          code,
          firstName,
          lastName
        }
      });

      console.log("Réponse Edge Function:", { data, error });

      if (error) {
        console.error("❌ Erreur Edge Function:", error);
        throw error;
      }

      if (data.success) {
        console.log("✅ Code OTP envoyé avec succès");
        
        toast({
          title: "Code envoyé !",
          description: `Un code de vérification a été envoyé à ${email}`,
          duration: 5000
        });
        
        return { 
          success: true, 
          messageId: data.messageId,
          message: data.message
        };
      } else {
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }
      
    } catch (error: any) {
      console.error("❌ Erreur lors de l'envoi du code OTP:", error);
      
      toast({
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer le code de vérification",
        variant: "destructive",
        duration: 6000
      });
      
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
