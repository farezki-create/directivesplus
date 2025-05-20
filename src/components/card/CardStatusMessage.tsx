
import React from "react";

interface CardStatusMessageProps {
  isCardReady: boolean;
  isGenerating: boolean;
}

const CardStatusMessage: React.FC<CardStatusMessageProps> = ({
  isCardReady,
  isGenerating
}) => {
  if (isGenerating) {
    return (
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
        <p>Génération des codes d'accès en cours... Veuillez patienter.</p>
      </div>
    );
  }
  
  if (!isCardReady) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
        <p>Codes d'accès manquants. Veuillez cliquer sur "Générer la carte" pour créer vos codes d'accès.</p>
      </div>
    );
  }
  
  return null;
};

export default CardStatusMessage;
