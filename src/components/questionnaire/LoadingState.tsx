
import React from "react";

export interface LoadingStateProps {
  loading: boolean;
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  loading,
  message = "Chargement en cours..."
}) => {
  if (!loading) return null;
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-10 h-10 rounded-full border-t-2 border-b-2 border-directiveplus-600 animate-spin"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;
