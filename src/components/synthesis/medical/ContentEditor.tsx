
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPaste, Save } from "lucide-react";

interface ContentEditorProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
  onStartPasting: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  extractedText,
  setExtractedText,
  isEditing,
  setIsEditing,
  isSaving,
  onSave,
  onStartPasting
}) => {
  return (
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
              onClick={onStartPasting}
              className="text-xs"
            >
              <ClipboardPaste className="h-3 w-3 mr-1" />
              Copier-coller
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
                onClick={onSave}
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
        <div className="text-sm text-gray-500 italic p-3 border rounded bg-gray-50 text-center">
          <p className="mb-2">Aucun contenu extrait.</p>
          <Button
            size="sm"
            onClick={onStartPasting}
            className="bg-green-600 hover:bg-green-700"
          >
            <ClipboardPaste className="h-3 w-3 mr-1" />
            Copier-coller le texte du PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
