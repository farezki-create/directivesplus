
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import SecurityAuditReport from '@/components/admin/SecurityAuditReport';

const SecurityAuditReportPage = () => {
  const { user, isAuthenticated } = useAuth();

  // Vérifier que l'utilisateur est authentifié et est admin
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Vérifier les permissions admin (email se terminant par @directivesplus.fr)
  const isAdmin = user?.email?.endsWith('@directivesplus.fr') || false;
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
            <p className="text-gray-600">
              Cette page est réservée aux administrateurs du système.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SecurityAuditReport />
    </div>
  );
};

export default SecurityAuditReportPage;
