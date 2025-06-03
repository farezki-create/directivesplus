
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useEmailConfirmationFlow = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // Vérifier si c'est une confirmation d'email
  const accessToken = searchParams.get('access_token');
  const type = searchParams.get('type');
  const confirmed = searchParams.get('confirmed');

  useEffect(() => {
    console.log("🔍 Vérification confirmation email:", { accessToken, type, confirmed, isAuthenticated, user });

    // Si l'utilisateur vient de confirmer son email
    if (accessToken && type === 'signup') {
      console.log("✅ Email confirmé détecté - déclenchement du processus 2FA");
      
      // Nettoyer l'URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      toast({
        title: "Email confirmé !",
        description: "Vérification par SMS requise pour finaliser votre inscription.",
        duration: 4000
      });
      
      // Activer le processus 2FA
      setPendingUserId(accessToken); // Temporaire - devrait être l'ID réel de l'utilisateur
      setShowTwoFactorAuth(true);
      
      return;
    }

    // Si l'utilisateur est déjà authentifié et n'est pas en cours de 2FA
    if (isAuthenticated && !showTwoFactorAuth) {
      console.log("🔄 Utilisateur déjà authentifié, redirection vers /rediger");
      navigate('/rediger', { replace: true });
    }
  }, [accessToken, type, confirmed, isAuthenticated, user, showTwoFactorAuth, navigate]);

  const handleTwoFactorSuccess = () => {
    console.log("✅ 2FA validée - finalisation de l'inscription");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    
    toast({
      title: "Inscription finalisée !",
      description: "Votre compte a été créé avec succès. Bienvenue !",
      duration: 4000
    });
    
    navigate('/rediger', { replace: true });
  };

  const handleTwoFactorCancel = () => {
    console.log("❌ 2FA annulée");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    navigate('/auth', { replace: true });
  };

  return {
    showTwoFactorAuth,
    pendingUserId,
    handleTwoFactorSuccess,
    handleTwoFactorCancel
  };
};
