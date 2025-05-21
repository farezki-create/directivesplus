
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const MirrorSourceAlert: React.FC = () => {
  return (
    <Alert className="mt-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">Information</AlertTitle>
      <AlertDescription className="text-blue-600">
        Cette représentation est une image miroir générée automatiquement.
        Les directives originales peuvent être consultées auprès du service médical.
      </AlertDescription>
    </Alert>
  );
};

export default MirrorSourceAlert;
