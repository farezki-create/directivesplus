
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const SecurityAlert: React.FC = () => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Shield className="h-5 w-5 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Accès sécurisé pour professionnels de santé</strong><br />
        Toutes les consultations sont tracées et sécurisées conformément à la réglementation.
      </AlertDescription>
    </Alert>
  );
};
