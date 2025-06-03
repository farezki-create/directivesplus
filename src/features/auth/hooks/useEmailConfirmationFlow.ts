
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);
  const [hasProcessedConfirmation, setHasProcessedConfirmation] = useState(false);

  useEffect(() => {
    // Vérifier si c'est une confirmation d'email (fragments d'URL Supabase)
    const fragment = location.hash;
    const fragmentParams = new URLSearchParams(fragment.substring(1));
    const fragmentAccessToken = fragmentParams.get('access_token');
    const fragmentRefreshToken = fragmentParams.get('refresh_token');
    const fragmentType = fragmentParams.get('type');
    
    console.log("🔍 Vérification confirmation email:", {
      fragment: location.hash,
      fragmentAccessToken: !!fragmentAccessToken,
      fragmentRefreshToken: !!fragmentRefreshToken,
      fragmentType,
      isAuthenticated,
      user: user?.id,
      isLoading,
      hasProcessedConfirmation,
      isProcessingConfirmation
    });

    // Si c'est une confirmation Supabase avec tokens et on est sur /auth et pas encore traité
    if (fragmentType === 'signup' && fragmentAccessToken && fragmentRefreshToken && location.pathname === '/auth' && !hasProcessedConfirmation && !isProcessingConfirmation) {
      console.log("✅ Confirmation Supabase détectée - traitement en cours...");
      setIsProcessingConfirmation(true);
      setHasProcessedConfirmation(true);
      
      // Connecter l'utilisateur avec les tokens de confirmation
      const connectUser = async () => {
        try {
          console.log("🔐 Connexion avec les tokens de confirmation...");
          
          const { data, error } = await supabase.auth.setSession({
            access_token: fragmentAccessToken,
            refresh_token: fragmentRefreshToken
          });

          if (error) {
            console.error("❌ Erreur lors de la connexion:", error);
            toast({
              title: "Erreur de confirmation",
              description: "Impossible de finaliser la confirmation. Veuillez réessayer.",
              variant: "destructive"
            });
            setIsProcessingConfirmation(false);
            return;
          }

          if (data.user) {
            console.log("✅ Utilisateur connecté après confirmation:", data.user.id);
            
            toast({
              title: "Email confirmé !",
              description: "Votre adresse email a été confirmée. Redirection vers votre espace...",
            });
            
            // Nettoyer l'URL et rediriger vers /rediger après un délai
            setTimeout(() => {
              window.history.replaceState({}, document.title, '/rediger');
              navigate('/rediger', { replace: true });
              setIsProcessingConfirmation(false);
            }, 2000);
          }
        } catch (error) {
          console.error("❌ Erreur lors de la connexion:", error);
          toast({
            title: "Erreur de confirmation",
            description: "Une erreur est survenue lors de la confirmation.",
            variant: "destructive"
          });
          setIsProcessingConfirmation(false);
        }
      };

      connectUser();
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de traitement sur /auth et pas de fragment de confirmation
    if (isAuthenticated && !isProcessingConfirmation && location.pathname === '/auth' && !fragmentAccessToken && !hasProcessedConfirmation) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [location.hash, location.pathname, isAuthenticated, user, navigate, isProcessingConfirmation, isLoading, hasProcessedConfirmation]);

  return {
    isProcessingConfirmation
  };
};
