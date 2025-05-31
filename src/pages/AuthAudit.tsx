
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthAuditReport } from '@/features/auth/audit/AuthAuditReport';
import { AuthSecurityMetrics } from '@/features/auth/audit/AuthSecurityMetrics';
import Header from '@/components/Header';

const AuthAudit = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Audit de Sécurité - Authentification Supabase
          </h1>
          <p className="text-gray-600">
            Analyse complète de la sécurité de votre système d'authentification
          </p>
        </div>

        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="report">Rapport d'Audit</TabsTrigger>
            <TabsTrigger value="metrics">Métriques de Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <AuthAuditReport />
          </TabsContent>

          <TabsContent value="metrics">
            <AuthSecurityMetrics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AuthAudit;
