
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";  // Import from lucide-react instead
import { Button } from "@/components/ui/button";

const NoDirectivesAlert: React.FC = () => {
  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        Aucune directive anticipée n'est disponible pour ce dossier.
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="mr-2"
          >
            Actualiser la page
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
          >
            Retour
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default NoDirectivesAlert;
