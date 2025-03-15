
import React from 'react';

interface PDFLoadingIndicatorProps {
  isLoading: boolean;
}

export function PDFLoadingIndicator({ isLoading }: PDFLoadingIndicatorProps) {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
