
import React, { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

interface SuccessViewProps {
  patientData?: {
    first_name: string;
    last_name: string;
    birth_date: string;
  } | null;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ patientData }) => {
  // Redirection automatique après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Redirection automatique vers /mes-directives");
      window.location.href = "/mes-directives";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Accès autorisé</strong><br />
          {patientData ? (
            <>
              Vous avez maintenant accès aux directives anticipées de{" "}
              <strong>
                {patientData.first_name} {patientData.last_name}
              </strong>
            </>
          ) : (
            "Vous avez maintenant accès aux directives anticipées"
          )}
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <div className="mb-4">
          <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Accès Institution Accordé
          </h3>
          <p className="text-gray-600 mt-1">
            Redirection automatique dans 3 secondes...
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = "/mes-directives"}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Consulter les directives maintenant
        </Button>
      </div>
    </div>
  );
};
