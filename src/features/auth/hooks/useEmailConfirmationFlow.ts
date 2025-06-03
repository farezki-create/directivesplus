
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
    const redirectTo = fragmentParams.get('redirect_to');
    
    console.log("🔍 Vérification confirmation email:", {
      fragment: location.hash,
      fragmentAccessToken: !!fragmentAccessToken,
      fragmentType,
      redirectTo,
      isAuthenticated,
      user: user?.id,
      isLoading
    });

    // Si c'est une confirmation Supabase et on est sur /auth
    if (fragmentType === 'signup' && location.pathname === '/auth') {
      console.log("✅ Confirmation Supabase détectée - traitement en cours...");
      setIsProcessingConfirmation(true);
      
      toast({
        title: "Email confirmé !",
        description: "Votre adresse email a été confirmée. Redirection vers la vérification SMS...",
      });
      
      // Nettoyer l'URL et rediriger vers 2FA
      setTimeout(() => {
        window.history.replaceState({}, document.title, '/auth/2fa');
        navigate('/auth/2fa', { replace: true });
        setIsProcessingConfirmation(false);
      }, 2000);
      
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de traitement sur /auth
    if (isAuthenticated && !isProcessingConfirmation && location.pathname === '/auth' && !fragmentAccessToken) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [location.hash, location.pathname, isAuthenticated, user, navigate, isProcessingConfirmation, isLoading]);

  return {
    isProcessingConfirmation
  };
};
