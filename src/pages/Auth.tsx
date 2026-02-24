
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleOTPAuth from "@/components/auth/SimpleOTPAuth";
import PasswordAuth from "@/components/auth/PasswordAuth";
import AuthDiagnostic from "@/components/debug/AuthDiagnostic";
import { Mail, Lock } from "lucide-react";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showDiagnostic, setShowDiagnostic] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleAuthSuccess = () => {
    // Auth success handled by context
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Connexion Sécurisée
            </h1>
            <p className="text-muted-foreground">
              Accédez à vos directives anticipées
            </p>
          </div>

          {!showDiagnostic ? (
            <>
              <Tabs defaultValue="password" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mot de passe
                  </TabsTrigger>
                  <TabsTrigger value="otp" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Code par email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <PasswordAuth onSuccess={handleAuthSuccess} />
                </TabsContent>

                <TabsContent value="otp">
                  <SimpleOTPAuth onSuccess={handleAuthSuccess} />
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowDiagnostic(true)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Problème de connexion ? Diagnostic →
                </button>
              </div>
            </>
          ) : (
            <>
              <AuthDiagnostic />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowDiagnostic(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Retour à la connexion
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              En vous connectant, vous acceptez nos{" "}
              <a href="/conditions-generales-utilisation" className="text-primary hover:underline">
                conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                politique de confidentialité
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
