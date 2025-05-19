
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type AuthErrorAlertProps = {
  errorMessage: string | null;
};

const AuthErrorAlert = ({ errorMessage }: AuthErrorAlertProps) => {
  if (!errorMessage) return null;

  const isNoProfiles = errorMessage.includes("Aucun profil n'existe");
  
  return (
    <Alert variant={isNoProfiles ? "default" : "destructive"} className={`mb-4 ${isNoProfiles ? "bg-amber-50 border-amber-200" : ""}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="ml-2">{isNoProfiles ? "Information" : "Erreur d'authentification"}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
      {!isNoProfiles && (
        <AlertDescription className="mt-2 text-xs">
          Vérifiez que le code correspond bien au format attendu (exemples: G24JKZBH, ABC123DE, DM-81847C2D)
        </AlertDescription>
      )}
    </Alert>
  );
};

export default AuthErrorAlert;
