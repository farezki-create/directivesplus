
import React from 'react';
import Header from "@/components/Header";
import { OTPAuthForm } from "./OTPAuthForm";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";

export const OTPAuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (user?: any) => {
    console.log("✅ Authentification OTP réussie:", user);
    
    if (user) {
      // Utilisateur existant - rediriger vers le tableau de bord
      navigate('/rediger', { replace: true });
    } else {
      // Nouveau utilisateur - rediriger vers l'inscription complète
      navigate('/auth?mode=register', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <BackButton />
          
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentification sécurisée
            </h1>
            <p className="text-gray-600">
              Connectez-vous ou inscrivez-vous avec un code de vérification
            </p>
          </div>
          
          <OTPAuthForm onSuccess={handleAuthSuccess} />
        </div>
      </main>
    </div>
  );
};
