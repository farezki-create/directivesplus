
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SecurityAlertsProps {
  errorMessage: string | null;
  remainingAttempts: number | null;
  blockedAccess: boolean;
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ 
  errorMessage,
  remainingAttempts,
  blockedAccess
}) => {
  return (
    <>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {remainingAttempts !== null && remainingAttempts < 3 && !blockedAccess && (
        <Alert variant="default" className="bg-amber-50 border-amber-500">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Attention</AlertTitle>
          <AlertDescription className="text-amber-700">
            {remainingAttempts <= 0 
              ? "Dernière tentative avant blocage temporaire."
              : `${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''} restante${remainingAttempts > 1 ? 's' : ''} avant blocage temporaire.`
            }
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SecurityAlerts;
