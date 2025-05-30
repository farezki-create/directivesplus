
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SmsData {
  to: string;
  message: string;
  sender?: string;
}

interface SmsResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
}

export const useBrevoSms = () => {
  const [isSending, setIsSending] = useState(false);

  const sendSms = async (smsData: SmsData): Promise<SmsResponse> => {
    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: smsData
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "SMS envoyé",
        description: data.message || "Le SMS a été envoyé avec succès",
      });

      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'envoi du SMS';
      
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
    sendSms,
    isSending
  };
};
