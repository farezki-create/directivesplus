
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const useAuthUrlHandling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  const token = searchParams.get('token');
  const type = searchParams.get('type') || location.hash.match(/type=([^&]+)/)?.[1];
  const resetToken = token;
  
  useEffect(() => {
    if (resetToken && (type === 'recovery' || type === 'password_recovery')) {
      setShowPasswordReset(true);
      setShowForgotPassword(false);
    }
  }, [resetToken, type]);

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowPasswordReset(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowPasswordReset(false);
    navigate('/auth', { replace: true });
  };

  const handlePasswordResetSuccess = () => {
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
    handleForgotPassword,
    handleBackToLogin,
    handlePasswordResetSuccess
  };
};
