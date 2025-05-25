
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { BackButton } from "./components/BackButton";
import { AuthContent } from "./components/AuthContent";
import { EmailVerificationView } from "./views/EmailVerificationView";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { PasswordResetView } from "./views/PasswordResetView";

const AuthPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  
  // Check for password reset token in URL - support both access_token and token
  const accessToken = searchParams.get('access_token');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const resetToken = accessToken || token;
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress) {
      const from = location.state?.from || "/rediger";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectInProgress]);

  // Handle password reset flow - check for both recovery and password_recovery types
  useEffect(() => {
    if (resetToken && (type === 'recovery' || type === 'password_recovery')) {
      console.log("Password reset token detected:", { resetToken, type });
      setShowPasswordReset(true);
      setShowForgotPassword(false);
      setShowEmailVerification(false);
    }
  }, [resetToken, type]);

  const handleVerificationSent = (email: string) => {
    setPendingEmail(email);
    setShowEmailVerification(true);
    setShowForgotPassword(false);
    setShowPasswordReset(false);
  };

  const handleVerificationComplete = () => {
    setShowEmailVerification(false);
    toast({
      title: "Compte activé",
      description: "Votre compte a été activé avec succès !",
    });
    const from = location.state?.from || "/rediger";
    navigate(from, { replace: true });
  };

  const handleBackToRegister = () => {
    setShowEmailVerification(false);
    setPendingEmail("");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowEmailVerification(false);
    setShowPasswordReset(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowPasswordReset(false);
    setShowEmailVerification(false);
    // Clear URL parameters
    navigate('/auth', { replace: true });
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    setShowForgotPassword(false);
    // Clear URL parameters
    navigate('/auth', { replace: true });
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (showEmailVerification) {
    return (
      <EmailVerificationView
        email={pendingEmail}
        onVerificationComplete={handleVerificationComplete}
        onBackToRegister={handleBackToRegister}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordView onBackToLogin={handleBackToLogin} />
    );
  }

  if (showPasswordReset && resetToken) {
    return (
      <PasswordResetView
        resetToken={resetToken}
        onSuccess={handlePasswordResetSuccess}
      />
    );
  }

  const redirectPath = location.state?.from || "/rediger";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          <AuthContent
            onVerificationSent={handleVerificationSent}
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
