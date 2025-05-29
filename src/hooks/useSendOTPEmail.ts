
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSendOTPEmail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendOTPEmail = async (email: string, token: string) => {
    setIsLoading(true);
    
    try {
      console.log('📧 Sending OTP email via SendGrid for:', email);
      
      const { data, error } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email,
          token
        }
      });

      if (error) {
        console.error('❌ Error calling send-otp-email function:', error);
        throw error;
      }

      console.log('✅ OTP email sent successfully:', data);
      
      toast({
        title: "Code envoyé",
        description: "Un code de vérification a été envoyé à votre email.",
      });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to send OTP email:', error);
      
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le code de vérification. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOTPEmail,
    isLoading,
  };
};
