
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye, EyeOff } from "lucide-react";
import { usePdfContentExtraction } from "@/hooks/usePdfContentExtraction";
import PdfDisplay from "./PdfDisplay";
import ContentEditor from "./ContentEditor";

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
    saveExtractedContent,
    startPasting
  } = usePdfContentExtraction({ document, onContentUpdate });

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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPdf(!showPdf)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              {showPdf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(document.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-blue-600">
          Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* PDF Display */}
          {showPdf && (
            <PdfDisplay
              document={document}
              extractedText={extractedText}
              onStartPasting={startPasting}
            />
          )}

          {/* Content Editor */}
          <ContentEditor
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSaving={isSaving}
            onSave={saveExtractedContent}
            onStartPasting={startPasting}
          />
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-700 font-medium flex items-center">
            <span className="mr-1">💡</span>
            {extractedText ? 
              "Contenu prêt pour l'intégration dans votre PDF" : 
              "Astuce: Ouvrez le PDF ci-dessus, copiez le texte important (Ctrl+A puis Ctrl+C) et cliquez sur 'Copier-coller'"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
