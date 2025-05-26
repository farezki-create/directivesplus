
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Activity, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SecurityQuickAccess = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email?.endsWith('@directivesplus.fr') || false;

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleAuditClick = () => {
    navigate('/security-dashboard');
  };

  const handleAlertsClick = () => {
    navigate('/security-dashboard');
  };

  const handleReportClick = () => {
    navigate('/security-audit-report');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <Shield className="w-5 h-5" />
          Accès Rapide - Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleAuditClick}
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Activity className="w-8 h-8 text-green-600" />
            <div className="text-center">
              <div className="font-semibold">Audit Rapide</div>
              <div className="text-sm text-gray-600">Vérification sécurité</div>
            </div>
          </Button>

          <Button 
            onClick={handleAlertsClick}
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="text-center">
              <div className="font-semibold">Alertes</div>
              <div className="text-sm text-gray-600">Monitoring temps réel</div>
            </div>
          </Button>

          <Button 
            onClick={handleReportClick}
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="text-center">
              <div className="font-semibold">Rapport HDS</div>
              <div className="text-sm text-gray-600">Audit complet</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityQuickAccess;
