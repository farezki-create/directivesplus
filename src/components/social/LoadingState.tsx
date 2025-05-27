
import React from "react";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="ml-4 text-gray-600 text-lg">Chargement des posts...</p>
    </div>
  );
};

export default LoadingState;
