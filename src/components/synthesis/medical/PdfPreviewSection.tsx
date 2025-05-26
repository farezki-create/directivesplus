
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { usePdfOperations } from "@/hooks/usePdfOperations";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

interface PdfPreviewSectionProps {
  document: Document;
  showPdf: boolean;
}

const PdfPreviewSection: React.FC<PdfPreviewSectionProps> = ({ document, showPdf }) => {
  const { handleSelectAll } = usePdfOperations();

  if (!showPdf) return null;

  return (
    <div className="bg-white rounded-md border p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Aperçu du document</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleSelectAll(document)}
          className="flex items-center gap-1 text-xs"
        >
          <ExternalLink className="h-3 w-3" />
          Ouvrir pour sélectionner
        </Button>
      </div>
      <iframe 
        src={document.file_path}
        className="w-full h-96 border rounded"
        title={document.file_name}
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default PdfPreviewSection;
