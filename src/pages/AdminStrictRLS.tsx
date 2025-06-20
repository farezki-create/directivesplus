
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import StrictRLSAuditDashboard from '@/components/admin/StrictRLSAuditDashboard';
import Header from '@/components/Header';

const AdminStrictRLS = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Check if user is admin
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

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

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StrictRLSAuditDashboard />
    </div>
  );
};

export default AdminStrictRLS;
