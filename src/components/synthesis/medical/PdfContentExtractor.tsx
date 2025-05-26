
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText, Eye, EyeOff, Copy, Save } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser le contenu extrait
  useEffect(() => {
    if (document.extracted_content) {
      setExtractedText(document.extracted_content);
    }
  }, [document.extracted_content]);

  // Fonction pour sauvegarder le contenu modifié
  const saveExtractedContent = async () => {
    if (!extractedText.trim()) {
      toast({
        title: "Contenu vide",
        description: "Veuillez saisir du contenu avant de sauvegarder",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setIsSaving(true);
    try {
      // Sauvegarder le contenu extrait en base de données
      const { error } = await supabase
        .from('medical_documents')
        .update({ extracted_content: extractedText })
        .eq('id', document.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde du contenu extrait:', error);
        throw error;
      }

      // Notifier le parent du nouveau contenu
      if (onContentUpdate) {
        onContentUpdate(document.id, extractedText);
      }

      setIsEditing(false);

      toast({
        title: "Contenu sauvegardé",
        description: "Le contenu du document a été sauvegardé et sera inclus dans vos directives anticipées",
        duration: 3000
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder le contenu du document",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour copier le texte par défaut
  const insertDefaultText = () => {
    const defaultContent = `CONTENU MÉDICAL - ${document.file_name}

📄 Document: ${document.file_name}
📅 Date: ${new Date(document.created_at).toLocaleDateString('fr-FR')}

INSTRUCTIONS POUR L'EXTRACTION:
1. Ouvrez le PDF ci-dessus
2. Sélectionnez le texte important (Ctrl+A pour tout sélectionner)
3. Copiez le texte (Ctrl+C)
4. Collez le texte dans cette zone (Ctrl+V)
5. Modifiez si nécessaire pour ne garder que l'essentiel
6. Cliquez sur "Sauvegarder"

CONTENU À EXTRAIRE:
[Collez ici le contenu copié du PDF]

Exemples d'informations importantes à inclure:
- Diagnostic médical
- Traitements en cours
- Recommandations médicales
- Informations sur l'évolution de l'état de santé
- Instructions particulières

Ces informations complètent mes directives anticipées et doivent être prises en compte par les professionnels de santé.`;

    setExtractedText(defaultContent);
    setIsEditing(true);
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
          {/* Affichage du PDF */}
          {showPdf && (
            <div className="bg-white rounded-md border p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Aperçu du document</h4>
                {!extractedText && (
                  <Button
                    size="sm"
                    onClick={insertDefaultText}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Préparer l'extraction
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

          {/* Zone d'édition du contenu */}
          <div className="bg-white rounded-md border p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">
                {extractedText ? "Contenu extrait" : "Extraire le contenu"}
              </h4>
              <div className="flex gap-2">
                {!extractedText && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={insertDefaultText}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Commencer
                  </Button>
                )}
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
                      <Save className="h-3 w-3 mr-1" />
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
                placeholder="Collez ici le contenu copié du PDF..."
                className="min-h-64 text-sm font-mono"
              />
            ) : extractedText ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto border p-3 rounded bg-gray-50">
                {extractedText}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic p-3 border rounded bg-gray-50">
                Aucun contenu extrait. Cliquez sur "Commencer" pour débuter l'extraction.
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-700 font-medium flex items-center">
            <span className="mr-1">💡</span>
            {extractedText ? 
              "Contenu prêt pour l'intégration dans votre PDF" : 
              "Instructions: Ouvrez le PDF ci-dessus, copiez le texte important et collez-le dans la zone d'édition"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContentExtractor;
