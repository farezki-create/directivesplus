
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  retryAfter?: number;
}

export const useBrevoSms = () => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendSms = async (smsData: SmsData): Promise<SmsResponse> => {
    if (!user) {
      const errorMessage = 'Vous devez être connecté pour envoyer des SMS';
      toast({
        title: "Authentification requise",
        description: errorMessage,
        variant: "destructive",
      });
      return {
        success: false,
        message: errorMessage,
        error: errorMessage
      };
    }

    setIsSending(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: smsData
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        // Handle rate limiting specifically
        if (data.retryAfter) {
          const minutes = Math.ceil(data.retryAfter / 60);
          toast({
            title: "Limite atteinte",
            description: `${data.error} Réessayez dans ${minutes} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur d'envoi",
            description: data.error,
            variant: "destructive",
          });
        }
        
        return {
          success: false,
          message: data.error,
          error: data.error,
          retryAfter: data.retryAfter
        };
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
