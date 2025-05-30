
import React from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Navigate } from 'react-router-dom';
import SecurityMonitor from '@/components/security/SecurityMonitor';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityAuditDashboard from '@/components/security/SecurityAuditDashboard';
import SecurityAuditReport from '@/components/admin/SecurityAuditReport';
import SecurityAlerts from '@/components/security/SecurityAlerts';

const SecurityDashboard = () => {
  const { isAdmin, loading, isAuthenticated } = useSecureAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h2>
              <p className="text-gray-600">
                Cette page est réservée aux administrateurs du système.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Centre de Sécurité
          </h1>
          <p className="text-gray-600 mt-2">
            Surveillance et audit de sécurité en temps réel
          </p>
        </div>

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitor">Monitoring</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
            <TabsTrigger value="report">Rapport</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <SecurityMonitor />
          </TabsContent>

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

export default SecurityDashboard;
