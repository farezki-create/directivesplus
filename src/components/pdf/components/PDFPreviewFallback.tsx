
import React from 'react';
import { FileText } from "lucide-react";

export const PDFPreviewFallback = () => {
  return (
    <div className="flex-grow relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8">
      <FileText size={64} className="text-gray-400 mb-4" />
      <p className="text-gray-700 text-lg font-medium mb-2">Document PDF disponible</p>
      <p className="text-gray-500 mb-6 text-center">
        Pour des raisons de compatibilité, le document ne peut pas être affiché directement dans l'application.<br/>
        Veuillez utiliser les options ci-dessous pour consulter le document.
      </p>
    </div>
  );
};
