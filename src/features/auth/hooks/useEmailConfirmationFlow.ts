
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
            
            toast({
              title: "Email confirmé !",
              description: "Votre inscription a été finalisée avec succès. Bienvenue !",
              duration: 4000
            });

            // Rediriger vers l'application
            setTimeout(() => {
              console.log("🚀 Redirection vers /rediger");
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
