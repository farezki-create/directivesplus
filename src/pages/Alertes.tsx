
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import UnifiedAlertsManager from '@/components/alerts/UnifiedAlertsManager';
import BackButton from '@/components/ui/back-button';

const Alertes = () => {
  const { user, isLoading } = useAuth();

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <BackButton label="Retour au Dashboard" onClick={() => window.history.back()} />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Centre d'Alertes
            </h1>
            <p className="text-gray-600">
              Gestion centralisée des alertes médicales et de sécurité
            </p>
          </div>

          <UnifiedAlertsManager />
        </div>
      </main>
    </div>
  );
};

export default Alertes;
