
import React from "react";

interface LoadingStateProps {
  retryCount: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ retryCount }) => {
  const getLoadingMessage = () => {
    if (retryCount === 0) {
      return "Chargement du document...";
    } else if (retryCount === 1) {
      return "Recherche dans les directives...";
    } else if (retryCount === 2) {
      return "Recherche dans les documents partagés...";
    } else {
      return `Tentative ${retryCount + 1}...`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">
              {getLoadingMessage()}
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500">
                Recherche en cours dans différentes sources de données...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
