
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OTPAuthForm } from '@/components/auth/OTPAuthForm';

const OTPAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirection si déjà authentifié
  if (isAuthenticated) {
    navigate('/rediger');
    return null;
  }

  const handleAuthSuccess = () => {
    navigate('/rediger');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DirectivesPlus</h1>
          <p className="text-gray-600">Connexion sécurisée par email</p>
        </div>
        
        <OTPAuthForm onSuccess={handleAuthSuccess} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Vous recevrez un code de vérification à 6 chiffres par email
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPAuth;
