
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ContentExtractionSectionProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isSaving: boolean;
  saveExtractedContent: () => Promise<void>;
}

const ContentExtractionSection: React.FC<ContentExtractionSectionProps> = ({
  extractedText,
  setExtractedText,
  isEditing,
  setIsEditing,
  isSaving,
  saveExtractedContent
}) => {
  return (
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
  );
};

export default ContentExtractionSection;
