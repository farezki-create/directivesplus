
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const SecurityAlert: React.FC = () => {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Information de sécurité :</strong> Cet accès a été journalisé. 
        La consultation de ce dossier est tracée conformément aux exigences réglementaires.
      </AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
