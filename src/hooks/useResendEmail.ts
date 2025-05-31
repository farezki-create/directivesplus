
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

export const useResendEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    setIsSending(true);
    
    try {
      console.log('📧 Tentative d\'envoi d\'email:', {
        to: emailData.to,
        type: emailData.type,
        subject: emailData.subject
      });

      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: emailData
      });

      console.log('📨 Réponse de la fonction Edge:', { data, error });

      if (error) {
        console.error('❌ Erreur de la fonction Edge:', error);
        
        let userFriendlyMessage = 'Erreur lors de l\'envoi de l\'email';
        
        if (error.message?.includes('Configuration manquante')) {
          userFriendlyMessage = 'Service d\'email temporairement indisponible';
        } else if (error.message?.includes('non-2xx')) {
          userFriendlyMessage = 'Erreur du service d\'email';
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
        console.error('❌ Erreur dans la réponse:', data);
        
        let userFriendlyMessage = data.error;
        
        if (data.error.includes('domaine non vérifié')) {
          userFriendlyMessage = 'Email envoyé via l\'adresse de test Resend';
        }
        
        toast({
          title: "Information",
          description: userFriendlyMessage,
          variant: data.error.includes('domaine non vérifié') ? "default" : "destructive",
          duration: 8000
        });
        
        return {
          success: data.error.includes('domaine non vérifié'),
          message: userFriendlyMessage,
          error: data.error,
          debug: data.debug
        };
      }

      if (data?.success) {
        console.log('✅ Email envoyé avec succès');
        
        toast({
          title: "Email envoyé",
          description: data.message || "L'email a été envoyé avec succès",
          duration: 6000
        });

        return {
          success: true,
          message: data.message,
          messageId: data.messageId
        };
      }

      // Cas de réponse inattendue
      console.warn('⚠️ Réponse inattendue:', data);
      
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
      console.error('💥 Erreur lors de l\'envoi:', error);
      
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
