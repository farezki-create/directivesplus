
import React from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

interface MobileAlertProps {
  isMobile?: boolean;
  isTablet?: boolean;
}

const MobileAlert: React.FC<MobileAlertProps> = ({ isMobile, isTablet }) => {
  if (!isMobile && !isTablet) return null;

  const icon = isMobile ? Smartphone : isTablet ? Tablet : Monitor;
  const deviceType = isMobile ? "Mobile" : "Tablette";
  const IconComponent = icon;

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-3">
        <IconComponent className="h-5 w-5 text-blue-600" />
        <div>
          <h3 className="font-medium text-blue-800">Appareil {deviceType} Détecté</h3>
          <p className="text-sm text-blue-700 mt-1">
            {isMobile ? (
              "Pour une meilleure expérience, utilisez le bouton de téléchargement vert pour ouvrir le PDF dans votre application par défaut."
            ) : (
              "Vous pouvez utiliser les boutons de navigation ou télécharger le document pour une lecture optimale."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileAlert;
