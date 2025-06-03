
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user } = useAuth();
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
      user: user?.id
    });

    // Si c'est une confirmation Supabase et on est sur /auth
    if (fragmentAccessToken && fragmentType === 'signup' && location.pathname === '/auth') {
      console.log("✅ Confirmation Supabase détectée - redirection vers /auth/2fa");
      
      // Nettoyer l'URL pour éviter les boucles
      window.history.replaceState({}, document.title, '/auth/2fa');
      
      // Rediriger vers la page 2FA
      navigate('/auth/2fa', { replace: true });
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de traitement sur /auth
    if (isAuthenticated && !isProcessingConfirmation && location.pathname === '/auth') {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [location.hash, location.pathname, isAuthenticated, user, navigate, isProcessingConfirmation]);

  return {
    isProcessingConfirmation
  };
};
