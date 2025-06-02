
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import InstitutionManagement from "@/components/admin/InstitutionManagement";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Navigate } from "react-router-dom";

const AdminInstitutions = () => {
  const { isAdmin, loading } = useSecureAuth();

  if (loading) {
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
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Administration des Institutions
            </h1>
            <p className="text-gray-600">
              Gérez les institutions abonnées et leurs droits d'accès aux structures de soins
            </p>
          </div>
          
          <InstitutionManagement />
        </div>
      </main>
    </div>
  );
};

export default AdminInstitutions;
