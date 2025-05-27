
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileText, ExternalLink } from "lucide-react";
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

  // Trouver le premier document PDF disponible
  const firstPdfDocument = dossierActif?.contenu?.directives?.find((item: any) => 
    item.type === 'document' && 
    item.file_path && 
    (item.content_type === 'application/pdf' || item.file_name?.toLowerCase().endsWith('.pdf'))
  );

  const handleOpenDirectPdf = () => {
    if (firstPdfDocument?.file_path) {
      console.log("Ouverture directe du PDF:", firstPdfDocument);
      window.open(firstPdfDocument.file_path, '_blank');
    }
  };

  const handleViewAllDirectives = () => {
    window.location.href = "/mes-directives";
  };

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
            Documents disponibles
          </p>
        </div>
        
        <div className="space-y-3">
          {firstPdfDocument && (
            <Button 
              onClick={handleOpenDirectPdf}
              className="bg-blue-600 hover:bg-blue-700 w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ouvrir le document principal ({firstPdfDocument.file_name})
            </Button>
          )}
          
          <Button 
            onClick={handleViewAllDirectives}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <FileText className="w-4 h-4 mr-2" />
            Voir toutes les directives
          </Button>
        </div>

        {firstPdfDocument && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Accès direct :</strong> Le document principal s'ouvre automatiquement dans un nouvel onglet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
