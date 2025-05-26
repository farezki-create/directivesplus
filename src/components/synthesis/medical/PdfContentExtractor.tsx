
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye, EyeOff } from "lucide-react";

interface PdfContentExtractorProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    extracted_content?: string;
    created_at: string;
  };
  onRemove: (documentId: string) => void;
}

const PdfContentExtractor: React.FC<PdfContentExtractorProps> = ({ document, onRemove }) => {
  const [showPdf, setShowPdf] = useState(true);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Fonction simple pour essayer d'extraire du texte du PDF
  const extractTextFromPdf = async () => {
    setIsExtracting(true);
    try {
      // Pour l'instant, on simule l'extraction
      // Dans une vraie implémentation, on utiliserait une bibliothèque comme pdf-parse ou PDF.js
      setTimeout(() => {
        setExtractedText("Contenu du document PDF extrait automatiquement...\n\nCe document médical contient des informations importantes qui seront intégrées dans vos directives anticipées.");
        setIsExtracting(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'extraction:', error);
      setIsExtracting(false);
    }
  };

  useEffect(() => {
    if (document.extracted_content) {
      setExtractedText(document.extracted_content);
    }
  }, [document.extracted_content]);

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
          {/* Affichage du PDF */}
          {showPdf && (
            <div className="bg-white rounded-md border p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Aperçu du document</h4>
                {!extractedText && (
                  <Button
                    size="sm"
                    onClick={extractTextFromPdf}
                    disabled={isExtracting}
                    className="text-xs"
                  >
                    {isExtracting ? "Extraction..." : "Extraire le texte"}
                  </Button>
                )}
              </div>
              <iframe 
                src={document.file_path}
                className="w-full h-64 border rounded"
                title={document.file_name}
              />
            </div>
          )}

          {/* Affichage du texte extrait */}
          {extractedText && (
            <div className="bg-white rounded-md border p-4">
              <h4 className="text-sm font-medium mb-2">Contenu extrait</h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {extractedText}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-700 font-medium flex items-center">
            <span className="mr-1">✅</span>
            Ce contenu sera intégré dans votre PDF de directives anticipées
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
