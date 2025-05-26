
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityAuditDashboard from '@/components/security/SecurityAuditDashboard';
import SecurityAuditReport from '@/components/admin/SecurityAuditReport';
import SecurityAlerts from '@/components/security/SecurityAlerts';

const SecurityAuditDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  // Vérifier que l'utilisateur est authentifié et est admin
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Vérifier les permissions admin
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Centre de Sécurité et d'Audit
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance, audit et conformité de sécurité en temps réel
          </p>
        </div>

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">Alertes & Monitoring</TabsTrigger>
            <TabsTrigger value="audit">Audit Rapide</TabsTrigger>
            <TabsTrigger value="report">Rapport Complet</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            <SecurityAlerts />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <SecurityAuditDashboard />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <SecurityAuditReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityAuditDashboardPage;
