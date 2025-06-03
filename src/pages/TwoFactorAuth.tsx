
import React from 'react';
import Header from "@/components/Header";
import { TwoFactorAuthView } from "@/features/auth/components/TwoFactorAuthView";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const TwoFactorAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdParam = searchParams.get('user_id');
    const emailConfirmed = searchParams.get('email_confirmed');
    
    console.log("🔐 Page 2FA - Paramètres reçus:", { userIdParam, emailConfirmed });
    
    if (!userIdParam) {
      console.log("❌ Pas d'ID utilisateur, redirection vers /auth");
      toast({
        title: "Erreur",
        description: "Session expirée. Veuillez vous reconnecter.",
        variant: "destructive"
      });
      navigate('/auth', { replace: true });
      return;
    }
    
    setUserId(userIdParam);
    
    // Nettoyer l'URL
    window.history.replaceState({}, document.title, '/auth/2fa');
  }, [searchParams, navigate]);

  const handleTwoFactorSuccess = () => {
    console.log("✅ 2FA réussie - redirection vers /rediger");
    toast({
      title: "Inscription finalisée !",
      description: "Votre compte a été créé avec succès. Bienvenue !",
      duration: 4000
    });
    
    // Redirection vers l'application
    window.location.href = '/rediger';
  };

  const handleTwoFactorCancel = () => {
    console.log("❌ 2FA annulée - retour à /auth");
    navigate('/auth', { replace: true });
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des paramètres...</p>
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
            userId={userId}
            onVerificationComplete={handleTwoFactorSuccess}
            onBack={handleTwoFactorCancel}
          />
        </div>
      </main>
    </div>
  );
};

export default TwoFactorAuth;
