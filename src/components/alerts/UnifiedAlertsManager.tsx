
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Activity } from 'lucide-react';
import AlertsManager from '@/components/symptom-tracker/AlertsManager';
import SecurityAlertsManager from './SecurityAlertsManager';

const UnifiedAlertsManager = () => {
  const [activeTab, setActiveTab] = useState('medical');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Alertes Médicales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">En temps réel</div>
            <p className="text-xs text-gray-500">Symptômes critiques</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Alertes Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Surveillées</div>
            <p className="text-xs text-gray-500">Monitoring actif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Statut Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Opérationnel</div>
            <p className="text-xs text-gray-500">Système fonctionnel</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Alertes Médicales
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Alertes Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical">
          <AlertsManager />
        </TabsContent>

        <TabsContent value="security">
          <SecurityAlertsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAlertsManager;
