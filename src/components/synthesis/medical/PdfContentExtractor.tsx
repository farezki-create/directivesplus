
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { usePdfContentExtraction } from "@/hooks/usePdfContentExtraction";
import PdfHeaderActions from "./PdfHeaderActions";
import PdfPreviewSection from "./PdfPreviewSection";
import ContentExtractionSection from "./ContentExtractionSection";
import PdfHelpSection from "./PdfHelpSection";

interface PdfContentExtractorProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    extracted_content?: string;
    created_at: string;
  };
  onRemove: (documentId: string) => void;
  onContentUpdate?: (documentId: string, content: string) => void;
}

const PdfContentExtractor: React.FC<PdfContentExtractorProps> = ({ document, onRemove, onContentUpdate }) => {
  const [showPdf, setShowPdf] = useState(true);
  
  const {
    extractedText,
    setExtractedText,
    isEditing,
    setIsEditing,
    isSaving,
    saveExtractedContent
  } = usePdfContentExtraction({ document, onContentUpdate });

  const handleRemove = () => onRemove(document.id);

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium text-blue-900">
              {document.file_name}
            </CardTitle>
          </div>
          <PdfHeaderActions
            showPdf={showPdf}
            setShowPdf={setShowPdf}
            onRemove={handleRemove}
          />
        </div>
        <p className="text-xs text-blue-600">
          Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <PdfPreviewSection
            document={document}
            showPdf={showPdf}
          />

          <ContentExtractionSection
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            saveExtractedContent={saveExtractedContent}
          />
        </div>
        
        <PdfHelpSection extractedText={extractedText} />
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
