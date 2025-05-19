
import { AlertTriangle, Database, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ConnectionStatus } from "@/hooks/access/useDatabaseConnection";

type ConnectionStatusAlertProps = {
  status: ConnectionStatus;
};

const ConnectionStatusAlert = ({ status }: ConnectionStatusAlertProps) => {
  if (status === "loading") {
    return (
      <Alert variant="default" className="mx-6 mb-2 bg-blue-50 border-blue-200">
        <Info className="h-4 w-4" />
        <AlertTitle className="ml-2">Connexion en cours</AlertTitle>
        <AlertDescription>
          Vérification de la connexion à la base de données...
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === "error") {
    return (
      <Alert variant="destructive" className="mx-6 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="ml-2">Problème de connexion</AlertTitle>
        <AlertDescription>
          Impossible de se connecter à la base de données. Veuillez réessayer plus tard ou contacter le support.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "warning") {
    return (
      <Alert variant="default" className="mx-6 mb-2 bg-amber-50 border-amber-200">
        <Database className="h-4 w-4" />
        <AlertTitle className="ml-2">Avertissement</AlertTitle>
        <AlertDescription>
          Connecté à la base de données, mais aucun profil utilisateur n'est disponible.
          Veuillez contacter l'administrateur pour créer un compte avant d'essayer d'accéder aux données.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ConnectionStatusAlert;
