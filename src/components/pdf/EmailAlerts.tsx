
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailAlertsProps {
  apiError: string | null;
  success: boolean;
}

export function EmailAlerts({ apiError, success }: EmailAlertsProps) {
  return (
    <>
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{apiError}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-sm">
            Email envoyé avec succès! Vérifiez votre boîte de réception (et dossier spam).
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
