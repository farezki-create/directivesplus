
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useAuthUrlHandling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  // Extraction des paramètres URL
  const accessToken = searchParams.get('access_token') || location.hash.match(/access_token=([^&]+)/)?.[1];
  const token = searchParams.get('token');
  const type = searchParams.get('type') || location.hash.match(/type=([^&]+)/)?.[1];
  const resetToken = accessToken || token;
  
  // Gestion de la confirmation email via URL
  useEffect(() => {
    if (accessToken && type === 'signup') {
      console.log("🔗 Confirmation email détectée via URL");
      
      // Nettoyer l'URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      toast({
        title: "Email confirmé !",
        description: "Votre email a été confirmé avec succès. Redirection vers votre espace...",
        duration: 4000
      });
      
      // Redirection vers l'application principale
      setTimeout(() => {
        navigate("/rediger", { replace: true });
      }, 2000);
      
      return;
    }
  }, [accessToken, type, navigate]);

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
  };

  const handleBackToLogin = () => {
    console.log("⬅️ Retour au formulaire de connexion");
    setShowForgotPassword(false);
    setShowPasswordReset(false);
    navigate('/auth', { replace: true });
  };

  const handlePasswordResetSuccess = () => {
    console.log("✅ Reset mot de passe réussi");
    setShowPasswordReset(false);
    setShowForgotPassword(false);
    navigate('/auth', { replace: true });
    
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.",
      duration: 6000
    });
  };

  return {
    showForgotPassword,
    showPasswordReset,
    resetToken,
    accessToken,
    type,
    location,
    handleForgotPassword,
    handleBackToLogin,
    handlePasswordResetSuccess
  };
};
