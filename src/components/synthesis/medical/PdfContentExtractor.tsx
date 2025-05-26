
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText, Eye, EyeOff, ExternalLink } from "lucide-react";
import { usePdfContentExtraction } from "@/hooks/usePdfContentExtraction";
import { toast } from "@/hooks/use-toast";

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

  const handleSelectAll = () => {
    window.open(document.file_path, '_blank');
    toast({
      title: "Document ouvert",
      description: "Utilisez Ctrl+A pour tout sélectionner, puis Ctrl+C pour copier le contenu",
      duration: 5000
    });
  };

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
          {/* Aperçu du document PDF */}
          {showPdf && (
            <div className="bg-white rounded-md border p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Aperçu du document</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAll}
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
          )}

          {/* Zone de texte simple pour l'extraction */}
          <div className="bg-white rounded-md border p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">
                {extractedText ? "Contenu extrait" : "Extraire le contenu"}
              </h4>
              <div className="flex gap-2">
                {extractedText && !isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="text-xs"
                  >
                    Modifier
                  </Button>
                )}
                {isEditing && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={saveExtractedContent}
                      disabled={isSaving}
                      className="text-xs"
                    >
                      {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="text-xs"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Saisissez ou collez ici le contenu du document..."
                className="min-h-64 text-sm"
              />
            ) : extractedText ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto border p-3 rounded bg-gray-50">
                {extractedText}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic p-3 border rounded bg-gray-50 text-center">
                <p className="mb-2">Aucun contenu extrait.</p>
                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ajouter du contenu
                </Button>
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              {extractedText.length} caractères
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-700 font-medium flex items-center">
            <span className="mr-1">💡</span>
            {extractedText ? 
              "Contenu prêt pour l'intégration dans votre PDF" : 
              "Cliquez sur 'Ouvrir pour sélectionner' puis utilisez Ctrl+A et Ctrl+C pour copier le contenu"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
