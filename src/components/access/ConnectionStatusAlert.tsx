
import { AlertTriangle, Database } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type ConnectionStatusAlertProps = {
  status: string | null;
};

const ConnectionStatusAlert = ({ status }: ConnectionStatusAlertProps) => {
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
          Vérifiez que vous utilisez la bonne clé d'API Supabase.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ConnectionStatusAlert;
