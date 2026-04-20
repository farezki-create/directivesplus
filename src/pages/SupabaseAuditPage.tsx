
import React from 'react';
import Header from '@/components/Header';
import SupabaseWarningsAnalyzer from '@/components/audit/SupabaseWarningsAnalyzer';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';

const SupabaseAuditPage = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <BackButton label="Retour au Dashboard" onClick={() => navigate('/admin/dashboard')} />
          <SupabaseWarningsAnalyzer />
        </div>
      </main>
    </div>
  );
};

export default SupabaseAuditPage;
