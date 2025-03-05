
import * as React from "react";
import { InfoIcon } from "lucide-react";

export const NotificationMessage = () => {
  return (
    <div className="p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 flex items-start gap-3">
      <InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">Produit bientôt disponible</p>
        <p className="text-sm mt-1">
          Ce produit n'est pas encore disponible à l'achat. Vous pouvez demander à être notifié lorsqu'il sera disponible.
        </p>
      </div>
    </div>
  );
};
