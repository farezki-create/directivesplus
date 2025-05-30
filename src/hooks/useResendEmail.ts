
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmailData {
  to: string;
  subject: string;
  type: 'confirmation' | 'password_reset';
  confirmationUrl?: string;
  resetUrl?: string;
  userName?: string;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
}

export const useResendEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: emailData
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        toast({
          title: "Erreur d'envoi",
          description: data.error,
          variant: "destructive",
        });
        
        return {
          success: false,
          message: data.error,
          error: data.error
        };
      }

      toast({
        title: "Email envoyé",
        description: data.message || "L'email a été envoyé avec succès",
      });

      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'envoi de l\'email';
      
      toast({
        title: "Erreur d'envoi",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendEmail,
    isSending
  };
};
