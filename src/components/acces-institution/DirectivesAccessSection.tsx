
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Key } from "lucide-react";
import { InstitutionAccessFormComplete } from "@/components/institution-access/InstitutionAccessFormComplete";

export const DirectivesAccessSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-orange-600" />
          Demande d'Accès avec Code Patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Accès ponctuel :</strong> Si vous n'avez pas d'abonnement institutionnel, 
            vous pouvez accéder aux directives d'un patient avec son code d'accès personnel.
          </AlertDescription>
        </Alert>
        
        <InstitutionAccessFormComplete />
      </CardContent>
    </Card>
  );
};
