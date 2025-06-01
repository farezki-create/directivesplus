
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { BackButton } from "./components/BackButton";
import { AuthContent } from "./components/AuthContent";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { PasswordResetView } from "./views/PasswordResetView";

const AuthPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  
  // Vérification des paramètres URL pour confirmation email et reset mot de passe
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
  
  // Redirection si déjà authentifié
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress && !accessToken) {
      console.log("🔄 Utilisateur déjà authentifié, redirection...");
      const from = location.state?.from || "/rediger";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectInProgress, accessToken]);

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

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Affichage pendant la confirmation email
  if (accessToken && type === 'signup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-directiveplus-600"></div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Confirmation en cours...
              </h2>
              <p className="text-gray-600">
                Votre email a été confirmé avec succès. Redirection vers votre espace dans quelques instants.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Page mot de passe oublié
  if (showForgotPassword) {
    return <ForgotPasswordView onBackToLogin={handleBackToLogin} />;
  }

  // Page reset mot de passe
  if (showPasswordReset && resetToken) {
    return (
      <PasswordResetView
        resetToken={resetToken}
        onSuccess={handlePasswordResetSuccess}
      />
    );
  }

  const redirectPath = location.state?.from || "/rediger";

  // Page principale d'authentification
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          
          <AuthContent
            redirectPath={redirectPath}
            setRedirectInProgress={setRedirectInProgress}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
