
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DirectivesTabProps {
  decryptedContent: any;
  hasDirectives: boolean;
  getDirectives?: () => any;  // Nouvelle fonction pour récupérer les directives
}

const DirectivesTab: React.FC<DirectivesTabProps> = ({ 
  decryptedContent, 
  hasDirectives,
  getDirectives 
}) => {
  console.log("DirectivesTab - Content:", decryptedContent, "hasDirectives:", hasDirectives);
  
  const renderDirectives = () => {
    if (!hasDirectives) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Aucune directive anticipée n'est disponible pour ce dossier.
          </AlertDescription>
        </Alert>
      );
    }

    let directives = getDirectives ? getDirectives() : 
                    (decryptedContent?.directives_anticipees || decryptedContent?.directives);
    
    console.log("DirectivesTab - Directives trouvées:", directives);
    
    if (!directives) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Contenu des directives anticipées non disponible.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (typeof directives === 'object') {
      return (
        <div className="space-y-4">
          {Object.entries(directives).map(([key, value]) => (
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
    
    return <p className="whitespace-pre-wrap">{String(directives)}</p>;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Directives Anticipées</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <FileText size={18} className="text-blue-600" />
              </TooltipTrigger>
              <TooltipContent>Directives du patient</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderDirectives()}
      </CardContent>
    </Card>
  );
};

export default DirectivesTab;
