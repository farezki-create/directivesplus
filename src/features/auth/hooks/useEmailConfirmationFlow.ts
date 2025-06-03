
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmationFlow = () => {
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Vérifier si nous sommes dans le processus de confirmation
      const urlParams = new URLSearchParams(window.location.search);
      const fragment = window.location.hash;
      
      console.log("🔍 Vérification confirmation email:", {
        urlParams: Object.fromEntries(urlParams),
        fragment
      });

      // Chercher les tokens dans l'URL ou le fragment
      const hasAccessToken = urlParams.has('access_token') || fragment.includes('access_token');
      const hasRefreshToken = urlParams.has('refresh_token') || fragment.includes('refresh_token');
      const hasType = urlParams.has('type') || fragment.includes('type');
      
      if (hasAccessToken && hasRefreshToken && hasType) {
        console.log("📧 Confirmation d'email détectée - traitement en cours...");
        setIsProcessingConfirmation(true);
        
        try {
          // Récupérer la session actuelle pour obtenir les infos utilisateur
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("❌ Erreur récupération session:", sessionError);
            throw sessionError;
          }

          if (session?.user) {
            console.log("✅ Email confirmé pour utilisateur:", session.user.id);
            
            // Envoyer SMS via Twilio maintenant que l'email est confirmé
            try {
              console.log("📱 Envoi du SMS via Twilio après confirmation email...");
              
              const phoneNumber = session.user.user_metadata?.phone_number;
              if (phoneNumber) {
                const { data: smsData, error: smsError } = await supabase.functions.invoke('send-twilio-sms', {
                  body: {
                    phoneNumber: phoneNumber,
                    userId: session.user.id
                  }
                });

                if (smsError) {
                  console.error("❌ Erreur SMS Twilio:", smsError);
                } else {
                  console.log("✅ SMS envoyé via Twilio");
                }
              }
            } catch (smsErr) {
              console.warn("⚠️ Erreur SMS (non bloquante):", smsErr);
            }

            toast({
              title: "Email confirmé !",
              description: "Un SMS de vérification a été envoyé à votre téléphone.",
              duration: 4000
            });

            // Rediriger vers la page 2FA
            setTimeout(() => {
              console.log("🚀 Redirection vers /auth/2fa");
              navigate('/auth/2fa', { replace: true });
            }, 1000);
          }
        } catch (error: any) {
          console.error("❌ Erreur traitement confirmation:", error);
          toast({
            title: "Erreur de confirmation",
            description: "Impossible de confirmer votre email. Veuillez réessayer.",
            variant: "destructive"
          });
          
          navigate('/auth', { replace: true });
        } finally {
          setIsProcessingConfirmation(false);
        }
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return {
    isProcessingConfirmation
  };
};
