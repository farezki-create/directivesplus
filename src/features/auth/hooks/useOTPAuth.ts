
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useOTPAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [target, setTarget] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms'>('email');

  const sendCode = async (targetValue: string, channelType: 'email' | 'sms') => {
    setIsLoading(true);
    
    try {
      console.log("📱 Envoi du code OTP via", channelType);
      
      const { data, error } = await supabase.functions.invoke('send-auth-code', {
        body: {
          target: targetValue,
          channel: channelType
        }
      });

      if (error) throw error;

      if (data.success) {
        console.log("✅ Code envoyé avec succès");
        setTarget(targetValue);
        setChannel(channelType);
        setStep('verify');
        
        toast({
          title: "Code envoyé",
          description: `Un code de vérification a été envoyé à votre ${channelType === 'email' ? 'email' : 'téléphone'}`
        });
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error: any) {
      console.error('❌ Erreur envoi code:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le code",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string): Promise<{ success: boolean; user?: any }> => {
    setIsLoading(true);
    
    try {
      console.log("🔍 Vérification du code OTP");
      
      const { data, error } = await supabase.rpc('verify_auth_code', {
        p_target: target,
        p_code: code
      });

      if (error) throw error;

      const result = data?.[0];
      
      if (result?.is_valid) {
        console.log("✅ Code vérifié avec succès");
        
        // Si l'utilisateur existe, le connecter
        if (result.user_id) {
          // Ici, vous pourriez implémenter une connexion automatique
          // ou rediriger vers le tableau de bord
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté"
          });
          
          return { success: true, user: { id: result.user_id } };
        } else {
          // Nouveau utilisateur - rediriger vers l'inscription
          toast({
            title: "Code vérifié",
            description: "Veuillez compléter votre inscription"
          });
          
          return { success: true };
        }
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code saisi est incorrect ou expiré",
          variant: "destructive"
        });
        
        return { success: false };
      }
    } catch (error: any) {
      console.error('❌ Erreur vérification code:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification du code",
        variant: "destructive"
      });
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('input');
    setTarget('');
    setChannel('email');
  };

  return {
    isLoading,
    step,
    target,
    channel,
    sendCode,
    verifyCode,
    resetFlow
  };
};
