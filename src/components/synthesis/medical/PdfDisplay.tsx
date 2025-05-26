
import React from 'react';
import { Button } from "@/components/ui/button";
import { ClipboardPaste } from "lucide-react";

interface PdfDisplayProps {
  document: {
    file_name: string;
    file_path: string;
  };
  extractedText: string;
  onStartPasting: () => void;
}

const PdfDisplay: React.FC<PdfDisplayProps> = ({ document, extractedText, onStartPasting }) => {
  return (
    <div className="bg-white rounded-md border p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Aperçu du document</h4>
        {!extractedText && (
          <Button
            size="sm"
            onClick={onStartPasting}
            className="text-xs bg-green-600 hover:bg-green-700"
          >
            <ClipboardPaste className="h-3 w-3 mr-1" />
            Copier-coller le texte
          </Button>
        )}
      </div>
      <iframe 
        src={document.file_path}
        className="w-full h-64 border rounded"
        title={document.file_name}
      />
    </div>
  );
};

export default PdfDisplay;
