
import React from "react";
import { Smartphone } from "lucide-react";

const MobileAlert: React.FC = () => {
  return (
    <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center gap-3">
        <Smartphone className="h-5 w-5 text-green-600" />
        <div>
          <h3 className="font-medium text-green-800">Mode Mobile Détecté</h3>
          <p className="text-sm text-green-700 mt-1">
            Pour une meilleure expérience, utilisez le bouton "Télécharger" vert ci-dessus pour ouvrir le PDF dans votre application de lecture par défaut.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileAlert;
