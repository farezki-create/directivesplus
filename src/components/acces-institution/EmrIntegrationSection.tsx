
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Database, FileText, Heart, BarChart3, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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
        
        {/* Liens directs pour l'intégration */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <FileText className="h-6 w-6 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800">Directives anticipées</h4>
              <p className="text-sm text-purple-700">Accès direct aux directives patients</p>
            </div>
            <Link to="/acces-institution">
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-600 text-purple-600 hover:bg-purple-100"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Accéder
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <Heart className="h-6 w-6 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800">Suivi palliatif</h4>
              <p className="text-sm text-purple-700">Données symptômes en temps réel</p>
            </div>
            <Link to="/acces-soins-palliatifs">
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-600 text-purple-600 hover:bg-purple-100"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Accéder
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <BarChart3 className="h-6 w-6 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800">Tableau de bord</h4>
              <p className="text-sm text-purple-700">Vue d'ensemble patients autorisés</p>
            </div>
            <Link to="/tableau-bord-institution">
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-600 text-purple-600 hover:bg-purple-100"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Accéder
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-purple-200">
            <Shield className="h-6 w-6 text-purple-600 flex-shrink-0" />
            <div className="flex-grow">
              <h4 className="font-medium text-purple-800">Accès sécurisé</h4>
              <p className="text-sm text-purple-700">Interface conforme RGPD</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-purple-600 text-purple-600 hover:bg-purple-100"
              disabled
            >
              Intégré
            </Button>
          </div>
        </div>

        <Alert className="border-purple-200 bg-purple-50">
          <Database className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>API disponible :</strong> Intégrez ces fonctionnalités directement 
            dans votre logiciel de dossier de soins via notre API sécurisée. 
            Documentation technique sur demande.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
