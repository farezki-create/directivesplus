
import { AlertCircle, Info } from "lucide-react";

export function EmailFormInfoSection() {
  return (
    <div className="flex flex-col space-y-2 text-xs text-muted-foreground mt-1">
      <p className="flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        Vérifiez également votre dossier spam après l'envoi
      </p>
      <p className="flex items-center">
        <Info className="h-3 w-3 mr-1" />
        L'email sera envoyé depuis no-reply@directivesplus.fr
      </p>
    </div>
  );
}
