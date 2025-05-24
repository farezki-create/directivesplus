
import React from "react";

interface LoadingStateProps {
  retryCount: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ retryCount }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">
              Chargement du document... 
              {retryCount > 0 && ` (Tentative ${retryCount + 1})`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
