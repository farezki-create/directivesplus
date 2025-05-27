
import React, { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileText } from "lucide-react";
import { useDossierStore } from "@/store/dossierStore";

interface SuccessViewProps {
  patientData?: {
    first_name: string;
    last_name: string;
    birth_date: string;
  } | null;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ patientData }) => {
  const { dossierActif } = useDossierStore();

  // Redirection automatique vers les directives sans délai
  useEffect(() => {
    console.log("SuccessView - Redirection immédiate vers /mes-directives");
    console.log("Dossier actif:", dossierActif);
    
    // Redirection immédiate
    window.location.href = "/mes-directives";
  }, [dossierActif]);

  // Affichage pendant le chargement de la redirection
  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Accès autorisé</strong><br />
          {patientData ? (
            <>
              Accès accordé aux directives anticipées de{" "}
              <strong>
                {patientData.first_name} {patientData.last_name}
              </strong>
            </>
          ) : (
            "Accès accordé aux directives anticipées"
          )}
        </AlertDescription>
      </Alert>
      
      <div className="text-center">
        <div className="mb-4">
          <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Accès Institution Accordé
          </h3>
          <p className="text-gray-600 mt-1 flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            Chargement des directives...
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = "/mes-directives"}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <FileText className="w-4 h-4 mr-2" />
          Accéder aux directives maintenant
        </Button>
      </div>
    </div>
  );
};
