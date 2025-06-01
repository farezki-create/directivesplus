
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailOptions {
  to: string;
  type: 'confirmation' | 'recovery' | 'invite';
  token?: string;
  subject?: string;
  content?: string;
}

export const useBrevoEmail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (options: EmailOptions) => {
    setIsLoading(true);
    
    try {
      console.log('📧 Envoi email via Brevo API:', options.type);
      
      const { data, error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          to: options.to,
          subject: options.subject || 'Email de DirectivesPlus',
          htmlContent: options.content || '',
          type: options.type,
          token: options.token
        }
      });

      if (error) {
        console.error('❌ Erreur edge function:', error);
        throw error;
      }

      console.log('✅ Email envoyé avec succès:', data);
      return { success: true, data };
      
    } catch (error: any) {
      console.error('💥 Erreur envoi email:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmail, isLoading };
};
