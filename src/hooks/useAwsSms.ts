
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SMSData {
  phoneNumber: string;
  message: string;
  type: 'verification' | 'notification';
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  message: string;
  error?: string;
  debug?: any;
}

export const useAwsSms = () => {
  const [isSending, setIsSending] = useState(false);

  const sendSMS = async (smsData: SMSData): Promise<SMSResponse> => {
    setIsSending(true);
    
    try {
      console.log('📱 Tentative d\'envoi de SMS via AWS SNS:', {
        phoneNumber: smsData.phoneNumber,
        type: smsData.type
      });

      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: smsData
      });

      console.log('📨 Réponse de la fonction AWS SNS:', { data, error });

      if (error) {
        console.error('❌ Erreur de la fonction AWS SNS:', error);
        
        let userFriendlyMessage = 'Erreur lors de l\'envoi du SMS';
        
        if (error.message?.includes('Configuration manquante')) {
          userFriendlyMessage = 'Service SMS temporairement indisponible';
        }
        
        toast({
          title: "Erreur d'envoi SMS",
          description: userFriendlyMessage,
          variant: "destructive",
          duration: 8000
        });
        
        return {
          success: false,
          message: userFriendlyMessage,
          error: error.message,
          debug: error
        };
      }

      if (data?.error) {
        console.error('❌ Erreur dans la réponse AWS SNS:', data);
        
        toast({
          title: "Erreur SMS",
          description: data.error,
          variant: "destructive",
          duration: 8000
        });
        
        return {
          success: false,
          message: data.error,
          error: data.error,
          debug: data.debug
        };
      }

      if (data?.success) {
        console.log('✅ SMS envoyé avec succès via AWS SNS');
        
        toast({
          title: "SMS envoyé",
          description: data.message || "Le SMS a été envoyé avec succès",
          duration: 6000
        });

        return {
          success: true,
          message: data.message,
          messageId: data.messageId
        };
      }

      console.warn('⚠️ Réponse inattendue d\'AWS SNS:', data);
      
      return {
        success: false,
        message: "Réponse inattendue du service SMS",
        debug: data
      };

    } catch (error: any) {
      console.error('💥 Erreur lors de l\'envoi SMS via AWS SNS:', error);
      
      const errorMessage = error.message || 'Erreur réseau lors de l\'envoi du SMS';
      
      toast({
        title: "Erreur réseau SMS",
        description: errorMessage,
        variant: "destructive",
        duration: 8000
      });

      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
        debug: {
          name: error.name,
          stack: error.stack
        }
      };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendSMS,
    isSending
  };
};
