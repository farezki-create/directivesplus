
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const SecurityAlert: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-5 w-5 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Accès sécurisé aux directives anticipées</strong><br />
        Cette interface permet aux professionnels de santé d'accéder aux directives 
        anticipées des patients avec leur autorisation explicite via un code d'accès personnel.
      </AlertDescription>
    </Alert>
  );
};
