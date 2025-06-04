
import React from 'react';
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ModernAuthForm } from "@/components/auth/ModernAuthForm";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirection si authentifié
  if (isAuthenticated) {
    navigate('/rediger');
    return null;
  }

  return (
    <div className="min-h-screen">
      <ModernAuthForm />
    </div>
  );
};

export default Auth;
