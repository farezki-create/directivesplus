
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

  useEffect(() => {
    // Vérifier si c'est une confirmation d'email (fragments d'URL Supabase)
    const fragment = location.hash;
    const fragmentParams = new URLSearchParams(fragment.substring(1));
    const fragmentAccessToken = fragmentParams.get('access_token');
    const fragmentType = fragmentParams.get('type');
    
    console.log("🔍 Vérification confirmation email:", {
      fragment: location.hash,
      fragmentAccessToken: !!fragmentAccessToken,
      fragmentType,
      isAuthenticated,
      user: user?.id,
      isLoading
    });

    // Si c'est une confirmation Supabase et on est sur /auth
    if (fragmentAccessToken && fragmentType === 'signup' && location.pathname === '/auth') {
      console.log("✅ Confirmation Supabase détectée - traitement en cours...");
      setIsProcessingConfirmation(true);
      
      // Nettoyer l'URL pour éviter les boucles
      window.history.replaceState({}, document.title, '/auth/2fa');
      
      // Attendre que l'authentification soit traitée
      const checkAuthAndRedirect = () => {
        if (!isLoading && isAuthenticated && user) {
          console.log("✅ Session établie après confirmation - redirection vers 2FA");
          setIsProcessingConfirmation(false);
          navigate('/auth/2fa', { replace: true });
        } else if (!isLoading && !isAuthenticated) {
          console.log("❌ Échec de la confirmation - retour à /auth");
          setIsProcessingConfirmation(false);
          toast({
            title: "Erreur de confirmation",
            description: "Le lien de confirmation a expiré ou est invalide.",
            variant: "destructive"
          });
          navigate('/auth', { replace: true });
        }
      };

      // Vérifier immédiatement si déjà authentifié
      if (!isLoading) {
        checkAuthAndRedirect();
      }
      
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de traitement sur /auth
    if (isAuthenticated && !isProcessingConfirmation && location.pathname === '/auth' && !fragmentAccessToken) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [location.hash, location.pathname, isAuthenticated, user, navigate, isProcessingConfirmation, isLoading]);

  // Effet séparé pour surveiller les changements d'authentification pendant le traitement
  useEffect(() => {
    if (isProcessingConfirmation && !isLoading) {
      if (isAuthenticated && user) {
        console.log("✅ Session établie pendant le traitement - redirection vers 2FA");
        setIsProcessingConfirmation(false);
        navigate('/auth/2fa', { replace: true });
      } else if (!isAuthenticated) {
        console.log("❌ Échec d'authentification pendant le traitement");
        setIsProcessingConfirmation(false);
        toast({
          title: "Erreur de confirmation",
          description: "Impossible d'établir la session. Veuillez réessayer.",
          variant: "destructive"
        });
        navigate('/auth', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, isProcessingConfirmation, navigate]);

  return {
    isProcessingConfirmation
  };
};
