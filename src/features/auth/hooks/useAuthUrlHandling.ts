
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useAuthUrlHandling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  
  // Extraction des paramètres URL
  const accessToken = searchParams.get('access_token') || location.hash.match(/access_token=([^&]+)/)?.[1];
  const token = searchParams.get('token');
  const type = searchParams.get('type') || location.hash.match(/type=([^&]+)/)?.[1];
  const resetToken = accessToken || token;
  
  // Gestion de la confirmation email via URL
  useEffect(() => {
    if (accessToken && type === 'signup') {
      console.log("🔗 Confirmation email détectée via URL - déclenchement 2FA SMS");
      
      // Nettoyer l'URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      toast({
        title: "Email confirmé !",
        description: "Vérification par SMS requise pour finaliser votre inscription.",
        duration: 4000
      });
      
      // Stocker l'ID utilisateur et afficher le 2FA
      setPendingUserId(accessToken); // Temporaire - à améliorer avec l'ID réel
      setShowTwoFactorAuth(true);
      
      return;
    }
  }, [accessToken, type]);

  // Gestion du reset mot de passe
  useEffect(() => {
    if (resetToken && (type === 'recovery' || type === 'password_recovery')) {
      console.log("🔑 Token de reset mot de passe détecté");
      setShowPasswordReset(true);
      setShowForgotPassword(false);
    }
  }, [resetToken, type]);

  const handleForgotPassword = () => {
    console.log("🔒 Affichage formulaire mot de passe oublié");
    setShowForgotPassword(true);
    setShowPasswordReset(false);
    setShowTwoFactorAuth(false);
  };

  const handleBackToLogin = () => {
    console.log("⬅️ Retour au formulaire de connexion");
    setShowForgotPassword(false);
    setShowPasswordReset(false);
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    navigate('/auth', { replace: true });
  };

  const handlePasswordResetSuccess = () => {
    console.log("✅ Reset mot de passe réussi");
    setShowPasswordReset(false);
    setShowForgotPassword(false);
    setShowTwoFactorAuth(false);
    navigate('/auth', { replace: true });
    
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.",
      duration: 6000
    });
  };

  const handleTwoFactorSuccess = () => {
    console.log("✅ Authentification 2FA réussie - redirection vers /rediger");
    setShowTwoFactorAuth(false);
    setPendingUserId(null);
    
    toast({
      title: "Inscription finalisée !",
      description: "Votre compte a été créé avec succès. Bienvenue !",
      duration: 4000
    });
    
    navigate('/rediger', { replace: true });
  };

  return {
    showForgotPassword,
    showPasswordReset,
    showTwoFactorAuth,
    resetToken,
    accessToken,
    type,
    pendingUserId,
    location,
    handleForgotPassword,
    handleBackToLogin,
    handlePasswordResetSuccess,
    handleTwoFactorSuccess
  };
};
