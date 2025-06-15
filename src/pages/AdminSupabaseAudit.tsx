
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AppNavigation from "@/components/AppNavigation";
import SupabaseAuditDashboard from "@/components/admin/SupabaseAuditDashboard";
import SupabaseOptimizationPanel from "@/components/admin/SupabaseOptimizationPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from '@/components/ui/back-button';

const AdminSupabaseAudit = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Check if user is admin based on email domain
  const isAdmin = isAuthenticated && user?.email?.endsWith('@directivesplus.fr');

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
      <AppNavigation hideEditingFeatures={true} />
      
      <main className="container mx-auto px-4 py-8">
        <BackButton label="Retour au Dashboard" onClick={() => window.location.href = '/admin/dashboard'} />
        
        <Tabs defaultValue="audit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit">Audit Complet</TabsTrigger>
            <TabsTrigger value="optimization">Optimisation</TabsTrigger>
          </TabsList>

          <TabsContent value="audit">
            <SupabaseAuditDashboard />
          </TabsContent>

          <TabsContent value="optimization">
            <SupabaseOptimizationPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminSupabaseAudit;
