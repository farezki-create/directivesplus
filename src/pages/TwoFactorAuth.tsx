
import React from 'react';
import Header from "@/components/Header";
import { TwoFactorAuthView } from "@/features/auth/components/TwoFactorAuthView";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("🔐 Page 2FA - État auth:", { isAuthenticated, userId: user?.id, isLoading });
    
    if (isLoading) {
      console.log("⏳ Chargement en cours...");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log("❌ Pas d'utilisateur authentifié, redirection vers /auth");
      toast({
        title: "Session requise",
        description: "Veuillez confirmer votre email d'abord.",
        variant: "destructive"
      });
      navigate('/auth', { replace: true });
      return;
    }
    
    console.log("✅ Utilisateur authentifié trouvé:", user.id);
    setIsReady(true);
  }, [isAuthenticated, user, isLoading, navigate]);

  const handleTwoFactorSuccess = () => {
    console.log("✅ 2FA réussie - redirection vers /rediger");
    toast({
      title: "Vérification réussie !",
      description: "Votre compte a été sécurisé avec succès. Bienvenue !",
      duration: 4000
    });
    
    // Redirection vers l'application
    window.location.href = '/rediger';
  };

  const handleTwoFactorCancel = () => {
    console.log("❌ 2FA annulée - retour à /auth");
    navigate('/auth', { replace: true });
  };

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? "Vérification de la session..." : "Préparation de la vérification SMS..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <TwoFactorAuthView
            userId={user.id}
            onVerificationComplete={handleTwoFactorSuccess}
            onBack={handleTwoFactorCancel}
          />
        </div>
      </main>
    </div>
  );
};

export default TwoFactorAuth;
