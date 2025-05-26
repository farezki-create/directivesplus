
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ContentEditorProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  extractedText,
  setExtractedText,
  onSave,
  isSaving
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenu extrait</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          placeholder="Le texte extrait apparaîtra ici. Vous pouvez aussi taper directement ou utiliser Ctrl+V pour coller."
          className="min-h-64 text-sm"
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">
            {extractedText.length} caractères
          </div>
          <Button
            onClick={onSave}
            disabled={isSaving || !extractedText.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder le contenu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
