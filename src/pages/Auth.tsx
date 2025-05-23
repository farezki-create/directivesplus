
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Hospital } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { LoginForm } from "@/features/auth/LoginForm";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { VerificationAlert } from "@/features/auth/VerificationAlert";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { PasswordResetForm } from "@/features/auth/PasswordResetForm";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState("");
  
  // Get the redirect path from location state or default to /dashboard
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    // Check if the URL contains a recovery token
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    
    if (token && type === "recovery") {
      setIsPasswordReset(true);
      setResetToken(token);
      toast({
        title: "Réinitialisez votre mot de passe",
        description: "Veuillez entrer votre nouveau mot de passe.",
      });
    }
  }, [searchParams]);
  
  // Handle verification alert when email is sent
  const handleVerificationSent = (email: string) => {
    setVerificationEmail(email);
    setVerificationSent(true);
  };

  // Handle successful password reset
  const handlePasswordResetSuccess = () => {
    setIsPasswordReset(false);
    toast({
      title: "Connexion",
      description: "Veuillez vous connecter avec votre nouveau mot de passe.",
    });
  };

  // Redirect if already authenticated, but only after the auth state has loaded
  // and prevent redirect loops with a flag
  useEffect(() => {
    if (!isLoading && isAuthenticated && !redirectInProgress && !isPasswordReset) {
      console.log("Auth page: Already authenticated, redirecting to:", from);
      setRedirectInProgress(true);
      
      // Use setTimeout to avoid race conditions with React rendering
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate, from, redirectInProgress, isPasswordReset]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // Don't render auth page if already authenticated and redirecting
  if (isAuthenticated && redirectInProgress && !isPasswordReset) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-directiveplus-600" />
        <p className="mt-4 text-gray-600">Redirection en cours...</p>
      </div>
    );
  }

  // Handle toggling forgot password form
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleCancelForgotPassword = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <Header />
      <div className="grid min-h-screen place-items-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Authentification</CardTitle>
            <CardDescription>Connectez-vous ou créez un compte pour accéder à vos directives.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {verificationSent && <VerificationAlert email={verificationEmail} />}
            
            {isPasswordReset ? (
              <PasswordResetForm token={resetToken} onSuccess={handlePasswordResetSuccess} />
            ) : showForgotPassword ? (
              <ForgotPasswordForm onCancel={handleCancelForgotPassword} />
            ) : (
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm 
                    onVerificationSent={handleVerificationSent}
                    redirectPath={from} 
                    setRedirectInProgress={setRedirectInProgress}
                    onForgotPassword={handleForgotPassword}
                  />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onVerificationSent={handleVerificationSent} />
                </TabsContent>
              </Tabs>
            )}
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/acces-institution')}
                className="text-directiveplus-600 hover:bg-directiveplus-50 flex items-center mx-auto"
              >
                <Hospital className="mr-2" size={16} />
                Accès pour les professionnels de santé
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 text-center w-full">
              En vous inscrivant, vous acceptez de recevoir un email de vérification.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Auth;
