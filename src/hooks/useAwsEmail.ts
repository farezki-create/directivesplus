
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
  debug?: any;
}

export const useAwsEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    setIsSending(true);
    
    try {
      console.log('📧 Tentative d\'envoi d\'email via AWS SES:', {
        to: emailData.to,
        type: emailData.type,
        subject: emailData.subject
      });

      const { data, error } = await supabase.functions.invoke('send-aws-email', {
        body: emailData
      });

      console.log('📨 Réponse de la fonction AWS SES:', { data, error });

      if (error) {
        console.error('❌ Erreur de la fonction AWS SES:', error);
        
        let userFriendlyMessage = 'Erreur lors de l\'envoi de l\'email';
        
        if (error.message?.includes('Configuration manquante')) {
          userFriendlyMessage = 'Service d\'email temporairement indisponible';
        } else if (error.message?.includes('MessageRejected')) {
          userFriendlyMessage = 'Email rejeté par le service d\'envoi';
        }
        
        toast({
          title: "Erreur d'envoi",
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
        console.error('❌ Erreur dans la réponse AWS SES:', data);
        
        toast({
          title: "Erreur",
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
        console.log('✅ Email envoyé avec succès via AWS SES');
        
        toast({
          title: "Email envoyé",
          description: data.message || "L'email a été envoyé avec succès via AWS SES",
          duration: 6000
        });

        return {
          success: true,
          message: data.message,
          messageId: data.messageId
        };
      }

      console.warn('⚠️ Réponse inattendue d\'AWS SES:', data);
      
      toast({
        title: "Attention",
        description: "Réponse inattendue du service d'email",
        variant: "destructive",
        duration: 6000
      });

      return {
        success: false,
        message: "Réponse inattendue du service",
        debug: data
      };

    } catch (error: any) {
      console.error('💥 Erreur lors de l\'envoi via AWS SES:', error);
      
      const errorMessage = error.message || 'Erreur réseau lors de l\'envoi de l\'email';
      
      toast({
        title: "Erreur réseau",
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
    sendEmail,
    isSending
  };
};
