
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Building2, UserPlus, CheckCircle, Database } from "lucide-react";
import { Link } from "react-router-dom";

export const InstitutionalSubscriptionSection: React.FC = () => {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Abonnement Institutionnel
        </CardTitle>
        <CardDescription>
          Solution privilégiée pour les établissements de santé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">
          <strong>Accès privilégié sans code patient :</strong> Les institutions partenaires 
          bénéficient d'un accès direct aux directives des patients selon les droits 
          accordés par l'administration.
        </p>
        
        {/* Avantages de l'abonnement */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Accès direct aux directives anticipées</h4>
              <p className="text-sm text-green-700">Consultation sans code d'accès patient</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Tableau de bord institution</h4>
              <p className="text-sm text-green-700">Vue d'ensemble de tous vos patients autorisés</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Suivi palliatif intégré</h4>
              <p className="text-sm text-green-700">Accès aux données de symptômes en temps réel</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Intégration dossier de soins</h4>
              <p className="text-sm text-green-700">API sécurisée pour intégration directe dans votre logiciel</p>
            </div>
          </div>
        </div>

        {/* Intégration dossier de soins */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-purple-800">Intégration Dossier de Soins</h4>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Intégrez DirectivesPlus directement dans votre système de dossiers de soins 
            pour un accès transparent aux informations des patients.
          </p>
          <p className="text-xs text-purple-600">
            <strong>API disponible :</strong> Documentation technique et support d'intégration 
            fournis avec l'abonnement institutionnel.
          </p>
        </div>

        {/* Actions d'abonnement */}
        <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-lg border border-blue-200">
          <UserPlus className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-grow">
            <h4 className="font-medium text-blue-800">Demande d'abonnement</h4>
            <p className="text-sm text-blue-700">
              Établissements de santé, EHPAD, cliniques
            </p>
          </div>
          <Link to="/demande-abonnement-institutionnel">
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-100"
            >
              Demander un accès
            </Button>
          </Link>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Important :</strong> Cette demande sera examinée par notre équipe. Un accès institutionnel permet de consulter les directives anticipées des patients et l'accès au suivi des symptômes selon les droits accordés par l'administration.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
