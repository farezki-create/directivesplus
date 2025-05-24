
import React from "react";

export const SharedDocumentLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
    </div>
  );
};
