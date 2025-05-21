
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MedicalDataTabProps {
  decryptedContent: any;
  decryptionError: boolean;
}

const MedicalDataTab: React.FC<MedicalDataTabProps> = ({ decryptedContent, decryptionError }) => {
  const renderDonneesMedicales = (contenu: any) => {
    if (!contenu) return <p>Aucune donnée disponible.</p>;
    
    if (decryptionError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de déchiffrement</AlertTitle>
          <AlertDescription>
            Impossible de déchiffrer les données du dossier. Le format ou la clé de déchiffrement pourrait être invalide.
          </AlertDescription>
        </Alert>
      );
    }

    // Filtrer les données médicales (exclure les directives anticipées pour cette section)
    const medicalData = { ...contenu };
    if (medicalData.directives_anticipees) {
      delete medicalData.directives_anticipees;
    }
    
    // Si c'est un objet JSON
    if (typeof medicalData === 'object' && Object.keys(medicalData).length > 0) {
      return (
        <div className="space-y-4">
          {Object.entries(medicalData).map(([key, value]) => (
            <div key={key} className="border-b pb-2">
              <h3 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h3>
              <div className="mt-1 text-gray-600">
                {typeof value === 'object' 
                  ? <pre className="bg-gray-50 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                  : String(value)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Si c'est du texte ou s'il n'y a pas de données médicales
    return <p className="whitespace-pre-wrap">{typeof medicalData === 'string' ? medicalData : "Aucune donnée médicale disponible."}</p>;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Informations Médicales</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ShieldCheck size={18} className="text-green-600" />
              </TooltipTrigger>
              <TooltipContent>Données chiffrées</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderDonneesMedicales(decryptedContent)}
      </CardContent>
    </Card>
  );
};

export default MedicalDataTab;
