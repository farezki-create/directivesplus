
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmationFlow = () => {
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fragment = window.location.hash;

      const hasAccessToken = urlParams.has('access_token') || fragment.includes('access_token');
      const hasRefreshToken = urlParams.has('refresh_token') || fragment.includes('refresh_token');
      const hasType = urlParams.has('type') || fragment.includes('type');
      
      if (hasAccessToken && hasRefreshToken && hasType) {
        setIsProcessingConfirmation(true);
        
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("❌ Erreur récupération session:", sessionError);
            throw sessionError;
          }

          if (session?.user) {
            toast({
              title: "Email confirmé !",
              description: "Votre inscription a été finalisée avec succès. Bienvenue !",
              duration: 4000
            });

            setTimeout(() => {
              navigate('/rediger', { replace: true });
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
