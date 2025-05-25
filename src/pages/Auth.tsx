
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { EmailVerificationForm } from "@/features/auth/EmailVerificationForm";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { PasswordResetForm } from "@/features/auth/PasswordResetForm";
import { LoginForm } from "@/features/auth/LoginForm";
import Header from "@/components/Header";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  
  // Check for password reset token in URL
  const resetToken = searchParams.get('access_token');
  const type = searchParams.get('type');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress) {
      const from = location.state?.from || "/rediger";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectInProgress]);

  // Handle password reset flow
  useEffect(() => {
    if (resetToken && type === 'recovery') {
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
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    setShowForgotPassword(false);
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-6"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Button>
            
            <EmailVerificationForm
              email={pendingEmail}
              onVerificationComplete={handleVerificationComplete}
              onBackToRegister={handleBackToRegister}
            />
          </div>
        </main>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-6"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Button>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Mot de passe oublié</CardTitle>
                <CardDescription>
                  Entrez votre email pour recevoir un lien de réinitialisation
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ForgotPasswordForm onCancel={handleBackToLogin} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (showPasswordReset && resetToken) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-6"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Button>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Nouveau mot de passe</CardTitle>
                <CardDescription>
                  Choisissez un nouveau mot de passe pour votre compte
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <PasswordResetForm 
                  token={resetToken} 
                  onSuccess={handlePasswordResetSuccess} 
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const redirectPath = location.state?.from || "/rediger";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Button>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Connexion / Inscription</CardTitle>
              <CardDescription>
                Accédez à votre espace personnel DirectivesPlus
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Se connecter</TabsTrigger>
                  <TabsTrigger value="signup">S'inscrire</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginForm 
                    onVerificationSent={handleVerificationSent}
                    redirectPath={redirectPath}
                    setRedirectInProgress={setRedirectInProgress}
                    onForgotPassword={handleForgotPassword}
                  />
                </TabsContent>
                
                <TabsContent value="signup">
                  <RegisterForm onVerificationSent={handleVerificationSent} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Auth;
