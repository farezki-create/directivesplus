
import React from "react";

interface LoadingStateProps {
  retryCount: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ retryCount }) => {
  const getLoadingMessage = () => {
    if (retryCount === 0) {
      return "Chargement du document...";
    } else if (retryCount === 1) {
      return "Recherche via fonction publique...";
    } else if (retryCount === 2) {
      return "Recherche dans les documents médicaux...";
    } else {
      return `Tentative ${retryCount + 1}...`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <div>
          <p className="text-gray-700 font-medium">
            {getLoadingMessage()}
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Recherche approfondie en cours... (Tentative {retryCount + 1}/3)
            </p>
          )}
        </div>
        
        {/* Indicateur de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (retryCount + 1) * 33)}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500">
          {retryCount === 0 && "Accès via QR code..."}
          {retryCount === 1 && "Vérification des permissions..."}
          {retryCount === 2 && "Recherche dans toutes les sources..."}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
