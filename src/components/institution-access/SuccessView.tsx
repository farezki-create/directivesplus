
import React from "react";
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

  // Trouver le premier document PDF disponible
  const firstPdfDocument = dossierActif?.contenu?.directives?.find((item: any) => 
    item.type === 'document' && 
    item.file_path && 
    (item.content_type === 'application/pdf' || item.file_name?.toLowerCase().endsWith('.pdf'))
  );

  const handleOpenInternalViewer = () => {
    if (firstPdfDocument?.id) {
      console.log("Ouverture dans le viewer interne:", firstPdfDocument);
      // Ouvrir dans le viewer PDF interne de l'application
      window.location.href = `/pdf-viewer?id=${firstPdfDocument.id}&type=document`;
    }
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
            Document disponible
          </p>
        </div>
        
        <div className="space-y-3">
          {firstPdfDocument && (
            <Button 
              onClick={handleOpenInternalViewer}
              className="bg-blue-600 hover:bg-blue-700 w-full"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Consulter le document ({firstPdfDocument.file_name})
            </Button>
          )}
        </div>

        {firstPdfDocument && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 <strong>Consultation sécurisée :</strong> Le document s'ouvre dans l'application pour garantir la confidentialité des données.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
