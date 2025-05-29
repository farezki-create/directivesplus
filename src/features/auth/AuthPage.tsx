
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
  
  // Check for email confirmation in URL hash or search params
  const accessToken = searchParams.get('access_token') || location.hash.match(/access_token=([^&]+)/)?.[1];
  const token = searchParams.get('token');
  const type = searchParams.get('type') || location.hash.match(/type=([^&]+)/)?.[1];
  const resetToken = accessToken || token;
  
  // Handle email confirmation via URL (email link clicked)
  useEffect(() => {
    if (accessToken && type === 'signup') {
      console.log("🔗 Email confirmation via URL detected, processing...");
      
      // Clear URL parameters to clean up the URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Show success message
      toast({
        title: "Email confirmé !",
        description: "Votre email a été confirmé avec succès. Redirection vers votre espace...",
      });
      
      // Redirect to the main app after a short delay
      setTimeout(() => {
        navigate("/rediger", { replace: true });
      }, 2000);
      
      return;
    }
  }, [accessToken, type, navigate]);
  
  // Redirect if already authenticated (but not during email confirmation)
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress && !accessToken) {
      console.log("🔄 User already authenticated, redirecting...");
      const from = location.state?.from || "/rediger";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectInProgress, accessToken]);

  // Handle password reset flow
  useEffect(() => {
    if (resetToken && (type === 'recovery' || type === 'password_recovery')) {
      console.log("🔑 Password reset token detected:", { resetToken, type });
      setShowPasswordReset(true);
      setShowForgotPassword(false);
      setShowEmailVerification(false);
    }
  }, [resetToken, type]);

  // Handler when user completes registration and needs OTP verification
  const handleVerificationSent = (email: string) => {
    console.log("📧 Registration completed, showing OTP verification for:", email);
    setPendingEmail(email);
    setShowEmailVerification(true);
    setShowForgotPassword(false);
    setShowPasswordReset(false);
  };

  // Handler when OTP verification is completed successfully
  const handleVerificationComplete = () => {
    console.log("✅ OTP verification completed successfully");
    setShowEmailVerification(false);
    toast({
      title: "Compte activé",
      description: "Votre compte a été activé avec succès !",
    });
    const from = location.state?.from || "/rediger";
    navigate(from, { replace: true });
  };

  const handleBackToRegister = () => {
    console.log("⬅️ Going back to registration form");
    setShowEmailVerification(false);
    setPendingEmail("");
  };

  const handleForgotPassword = () => {
    console.log("🔒 Showing forgot password form");
    setShowForgotPassword(true);
    setShowEmailVerification(false);
    setShowPasswordReset(false);
  };

  const handleBackToLogin = () => {
    console.log("⬅️ Going back to login form");
    setShowForgotPassword(false);
    setShowPasswordReset(false);
    setShowEmailVerification(false);
    // Clear URL parameters
    navigate('/auth', { replace: true });
  };

  const handlePasswordResetSuccess = () => {
    console.log("✅ Password reset completed successfully");
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

  // Show confirmation message if email confirmation is in progress
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

  // Show OTP verification page (when user registers and needs to enter 6-digit code)
  if (showEmailVerification) {
    console.log("📱 Rendering OTP verification page for email:", pendingEmail);
    return (
      <EmailVerificationView
        email={pendingEmail}
        onVerificationComplete={handleVerificationComplete}
        onBackToRegister={handleBackToRegister}
      />
    );
  }

  // Show forgot password page
  if (showForgotPassword) {
    console.log("🔒 Rendering forgot password page");
    return (
      <ForgotPasswordView onBackToLogin={handleBackToLogin} />
    );
  }

  // Show password reset page (when user clicks reset link in email)
  if (showPasswordReset && resetToken) {
    console.log("🔑 Rendering password reset page");
    return (
      <PasswordResetView
        resetToken={resetToken}
        onSuccess={handlePasswordResetSuccess}
      />
    );
  }

  const redirectPath = location.state?.from || "/rediger";

  console.log("🏠 Rendering main auth page (login/register)");
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
