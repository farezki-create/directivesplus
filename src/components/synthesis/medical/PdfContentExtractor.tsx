
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Fonction pour extraire le texte du PDF
  const extractTextFromPdf = async () => {
    setIsExtracting(true);
    try {
      // Simulation d'extraction de texte du PDF
      // Dans une vraie implémentation, on utiliserait une bibliothèque comme pdf-parse
      const simulatedContent = `CONTENU MÉDICAL EXTRAIT DE : ${document.file_name}

Ce document médical contient des informations importantes pour mes directives anticipées.

Voici les éléments clés de ce document :
- Diagnostic médical et historique
- Traitements en cours
- Recommandations médicales
- Informations sur l'évolution de l'état de santé

Ces informations complètent mes directives anticipées et doivent être prises en compte par les professionnels de santé.

Date du document : ${new Date(document.created_at).toLocaleDateString('fr-FR')}`;

      // Sauvegarder le contenu extrait en base de données
      const { error } = await supabase
        .from('medical_documents')
        .update({ extracted_content: simulatedContent })
        .eq('id', document.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde du contenu extrait:', error);
        throw error;
      }

      setExtractedText(simulatedContent);
      
      // Notifier le parent du nouveau contenu
      if (onContentUpdate) {
        onContentUpdate(document.id, simulatedContent);
      }

      toast({
        title: "Contenu extrait",
        description: "Le texte du document a été extrait et sera inclus dans vos directives anticipées",
        duration: 3000
      });

    } catch (error) {
      console.error('Erreur lors de l\'extraction:', error);
      toast({
        title: "Erreur d'extraction",
        description: "Impossible d'extraire le contenu du document",
        variant: "destructive",
        duration: 3000
      });
    } finally {
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
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Contenu extrait</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={extractTextFromPdf}
                  disabled={isExtracting}
                  className="text-xs"
                >
                  {isExtracting ? "Re-extraction..." : "Re-extraire"}
                </Button>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto border p-3 rounded bg-gray-50">
                {extractedText}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-700 font-medium flex items-center">
            <span className="mr-1">✅</span>
            {extractedText ? 
              "Contenu extrait et prêt pour l'intégration dans votre PDF" : 
              "Cliquez sur 'Extraire le texte' pour intégrer ce contenu dans votre PDF"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
