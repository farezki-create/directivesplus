
import React from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContent } from "@/features/auth/components/AuthContent";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEmailConfirmationFlow } from "@/features/auth/hooks/useEmailConfirmationFlow";
import { LoadingView } from "@/features/auth/components/LoadingView";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isProcessingConfirmation } = useEmailConfirmationFlow();

  // État de chargement
  if (isLoading || isProcessingConfirmation) {
    return <LoadingView />;
  }

  // Redirection si authentifié
  if (isAuthenticated) {
    navigate('/rediger');
    return null;
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            ← Retour à l'accueil
          </Button>

          <AuthContent
            redirectPath="/rediger"
            setRedirectInProgress={() => {}}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </main>
    </div>
  );
};

export default Auth;
