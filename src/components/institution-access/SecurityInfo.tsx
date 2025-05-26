
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const SecurityInfo: React.FC = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Information importante :</strong> L'accès aux directives anticipées 
        nécessite la saisie exacte des informations personnelles du patient 
        (nom, prénom, date de naissance) ainsi que le code d'accès qu'il vous a fourni.
        Tous les accès sont enregistrés conformément aux réglementations en vigueur.
      </AlertDescription>
    </Alert>
  );
};
