
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, FileText, Heart, BarChart3, Shield } from "lucide-react";

export const EmrIntegrationSection: React.FC = () => {
  return (
    <Card className="mb-6 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-600" />
          Intégration Dossier de Soins
        </CardTitle>
        <CardDescription>
          Accès direct aux fonctionnalités depuis votre dossier institutionnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Intégrez DirectivesPlus directement dans votre système de dossiers de soins 
          pour un accès transparent aux informations des patients.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
            <FileText className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800 text-sm">Directives anticipées</h4>
              <p className="text-xs text-purple-700">Consultation sécurisée</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
            <Heart className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800 text-sm">Suivi palliatif</h4>
              <p className="text-xs text-purple-700">Données en temps réel</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
            <BarChart3 className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800 text-sm">Tableau de bord</h4>
              <p className="text-xs text-purple-700">Vue d'ensemble patients</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
            <Shield className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800 text-sm">Accès sécurisé</h4>
              <p className="text-xs text-purple-700">Conforme RGPD</p>
            </div>
          </div>
        </div>

        <Alert className="border-purple-200 bg-purple-50">
          <Database className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Intégration API disponible :</strong> Connectez DirectivesPlus 
            à votre logiciel de dossier de soins via notre API sécurisée. 
            Documentation technique sur demande.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
