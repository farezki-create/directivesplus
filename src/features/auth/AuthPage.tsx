
import Header from "@/components/Header";
import { BackButton } from "./components/BackButton";
import { AuthContent } from "./components/AuthContent";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { PasswordResetView } from "./views/PasswordResetView";
import { useAuthUrlHandling } from "./hooks/useAuthUrlHandling";
import { useAuthRedirection } from "./hooks/useAuthRedirection";
import { useEmailConfirmationFlow } from "./hooks/useEmailConfirmationFlow";
import { LoadingView } from "./components/LoadingView";
import { DebugSection } from "./components/DebugSection";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  const {
    showForgotPassword,
    showPasswordReset,
    resetToken,
    handleForgotPassword,
    handleBackToLogin,
    handlePasswordResetSuccess
  } = useAuthUrlHandling();

  const {
    redirectInProgress,
    setRedirectInProgress,
    redirectPath
  } = useAuthRedirection();

  const {
    isProcessingConfirmation
  } = useEmailConfirmationFlow();

  // État de chargement (incluant le traitement de confirmation)
  if (isLoading || isProcessingConfirmation) {
    return <LoadingView />;
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

  // Page principale d'authentification
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          
          <DebugSection />
          
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
