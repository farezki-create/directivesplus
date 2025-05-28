
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Database, 
  FileText, 
  AlertTriangle,
  Settings,
  Eye
} from "lucide-react";

const SecurityQuickActions = () => {
  const navigate = useNavigate();

  const securityActions = [
    {
      title: "Audit Complet",
      description: "Audit de sécurité global de l'application",
      icon: Shield,
      action: () => navigate('/security-dashboard'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Audit RLS",
      description: "Audit spécialisé des politiques Row Level Security",
      icon: Database,
      action: () => navigate('/rls-audit'),
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Rapport de Conformité",
      description: "Rapport détaillé de conformité HDS",
      icon: FileText,
      action: () => navigate('/security-audit-report'),
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Alertes Sécurité",
      description: "Monitoring temps réel des alertes",
      icon: AlertTriangle,
      action: () => navigate('/security-dashboard?tab=alerts'),
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Actions Rapides - Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left"
                onClick={action.action}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityQuickActions;
