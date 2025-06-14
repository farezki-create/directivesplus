
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface AccessSuccessViewProps {
  patientData: {
    first_name?: string;
    last_name?: string;
  } | null;
}

export const AccessSuccessView: React.FC<AccessSuccessViewProps> = ({
  patientData
}) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Accès autorisé</strong><br />
          Vous avez maintenant accès aux directives anticipées de{" "}
          <strong>
            {patientData?.first_name} {patientData?.last_name}
          </strong>
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col gap-3 mt-6">
        <Button 
          onClick={() => window.location.href = "/mes-directives"}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Consulter les directives maintenant
        </Button>
      </div>
    </div>
  );
};
