
import React from 'react';

export const PDFLoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-8 w-8 border-b-2 border-primary rounded-full animate-spin"></div>
    </div>
  );
};
