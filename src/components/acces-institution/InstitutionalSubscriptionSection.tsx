
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Building2, UserPlus } from "lucide-react";
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
          Accès privilégié pour les établissements de santé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Les institutions partenaires peuvent accéder directement aux directives 
          des patients selon les droits accordés par l'administration.
        </p>
        
        <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-lg border border-blue-200">
          <UserPlus className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="flex-grow">
            <h4 className="font-medium text-blue-800">Demande d'abonnement</h4>
            <p className="text-sm text-blue-700">
              Établissements de santé, EHPAD, cliniques - Accès sans code
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

        <div className="flex items-center gap-3 p-4 bg-green-100 rounded-lg border border-green-200">
          <Building2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div className="flex-grow">
            <h4 className="font-medium text-green-800">Tableau de bord institution</h4>
            <p className="text-sm text-green-700">
              Accédez aux patients autorisés pour votre institution
            </p>
          </div>
          <Link to="/tableau-bord-institution">
            <Button 
              variant="outline" 
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-100"
            >
              Tableau de bord
            </Button>
          </Link>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Building2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Avantages de l'abonnement :</strong> Accès direct aux directives 
            anticipées des patients selon les droits accordés, sans nécessité de code d'accès.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
