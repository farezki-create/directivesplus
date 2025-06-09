
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OTPAuthForm from "@/components/auth/OTPAuthForm";
import { Mail, Lock } from "lucide-react";

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("otp");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthSuccess = () => {
    // La redirection sera gérée automatiquement par le contexte d'authentification
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion
            </h1>
            <p className="text-gray-600">
              Accédez à vos directives anticipées
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="otp" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Code par email
              </TabsTrigger>
              <TabsTrigger value="traditional" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Traditionnel
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="otp" className="mt-6">
              <OTPAuthForm onSuccess={handleAuthSuccess} />
            </TabsContent>
            
            <TabsContent value="traditional" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion traditionnelle</CardTitle>
                  <CardDescription>
                    Mode de connexion classique (bientôt disponible)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Cette méthode de connexion sera bientôt disponible.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("otp")}
                    >
                      Utiliser le code par email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
