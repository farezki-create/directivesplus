
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type AuthErrorAlertProps = {
  errorMessage: string | null;
};

const AuthErrorAlert = ({ errorMessage }: AuthErrorAlertProps) => {
  if (!errorMessage) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="ml-2">Erreur d'authentification</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      <AlertDescription className="mt-2 text-xs">
        Vérifiez que le code correspond bien au format attendu (exemples: G24JKZBH, ABC123DE, DM-81847C2D)
      </AlertDescription>
    </Alert>
  );
};

export default AuthErrorAlert;
