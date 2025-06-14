
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SimpleOTPAuth from "@/components/auth/SimpleOTPAuth";
import { Info } from "lucide-react";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleAuthSuccess = () => {
    console.log("Authentification réussie");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Sécurisée
            </h1>
            <p className="text-gray-600">
              Accédez à vos directives anticipées
            </p>
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Authentification simplifiée :</strong>
              <br />
              1. Saisissez votre email
              <br />
              2. Recevez un code à 6 chiffres par email
              <br />
              3. Saisissez le code pour vous connecter
              <br />
              Un compte sera créé automatiquement si nécessaire.
            </AlertDescription>
          </Alert>

          <SimpleOTPAuth onSuccess={handleAuthSuccess} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              En vous connectant, vous acceptez nos{" "}
              <a href="/conditions-generales-utilisation" className="text-directiveplus-600 hover:underline">
                conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="/politique-confidentialite" className="text-directiveplus-600 hover:underline">
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
