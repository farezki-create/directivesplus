
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import AdminNewsManager from '@/components/health-news/AdminNewsManager';
import BackButton from '@/components/ui/back-button';

const AdminHealthNews = () => {
  const { isAdmin, isLoading } = useAuth();

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
          <BackButton 
            label="Retour au Dashboard" 
            onClick={() => window.location.href = '/admin/dashboard'} 
          />
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Actualités Santé
            </h1>
            <p className="text-gray-600 mt-2">
              Créez et gérez les actualités santé visibles par tous les utilisateurs
            </p>
          </div>
          <AdminNewsManager />
        </div>
      </main>
    </div>
  );
};

export default AdminHealthNews;
