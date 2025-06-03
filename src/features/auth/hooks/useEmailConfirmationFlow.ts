
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

  useEffect(() => {
    // Vérifier si c'est une confirmation d'email standard (fragments d'URL Supabase)
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

    // Si c'est une confirmation Supabase standard, rediriger vers la page 2FA
    if (fragmentAccessToken && fragmentType === 'signup') {
      console.log("✅ Confirmation Supabase détectée - redirection vers /auth/2fa");
      
      // Nettoyer l'URL
      window.history.replaceState({}, document.title, '/auth');
      
      // Démarrer un processus de vérification de session
      setIsProcessingConfirmation(true);
      
      setTimeout(() => {
        // Rediriger vers la page 2FA avec l'ID utilisateur si disponible
        if (user?.id) {
          window.location.href = `/auth/2fa?user_id=${user.id}&email_confirmed=true`;
        } else {
          // Attendre encore un peu pour que l'auth se stabilise
          setTimeout(() => {
            if (user?.id) {
              window.location.href = `/auth/2fa?user_id=${user.id}&email_confirmed=true`;
            } else {
              toast({
                title: "Erreur",
                description: "Problème lors de la confirmation. Veuillez réessayer.",
                variant: "destructive"
              });
              navigate('/auth', { replace: true });
            }
            setIsProcessingConfirmation(false);
          }, 2000);
        }
      }, 1000);
      
      return;
    }

    // Si l'utilisateur est authentifié et pas en cours de traitement
    if (isAuthenticated && !isProcessingConfirmation) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [searchParams, location.hash, isAuthenticated, user, navigate, isProcessingConfirmation]);

  const handleTwoFactorSuccess = async () => {
    console.log("✅ 2FA validée - finalisation de l'inscription");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    
    toast({
      title: "Inscription finalisée !",
      description: "Votre compte a été créé avec succès. Bienvenue !",
      duration: 4000
    });
    
    // Forcer une redirection complète
    window.location.href = '/rediger';
  };

  const handleTwoFactorCancel = () => {
    console.log("❌ 2FA annulée");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    setIsProcessingConfirmation(false);
    
    navigate('/auth', { replace: true });
  };

  return {
    showTwoFactorAuth,
    pendingUserId,
    handleTwoFactorSuccess,
    handleTwoFactorCancel,
    isProcessingConfirmation
  };
};
