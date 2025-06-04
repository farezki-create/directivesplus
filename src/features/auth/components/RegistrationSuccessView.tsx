
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export const RegistrationSuccessView = () => {
  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="space-y-2">
          <p className="font-medium">Inscription finalisée avec succès !</p>
          <p>Redirection vers votre espace en cours...</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
