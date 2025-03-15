
import React from "react";

interface PDFGenerationOverlayProps {
  isVisible: boolean;
  message: string;
}

export function PDFGenerationOverlay({ isVisible, message }: PDFGenerationOverlayProps) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg font-medium text-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
