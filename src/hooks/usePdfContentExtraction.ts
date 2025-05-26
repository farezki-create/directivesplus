
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UsePdfContentExtractionProps {
  document: {
    id: string;
    file_name: string;
    extracted_content?: string;
  };
  onContentUpdate?: (documentId: string, content: string) => void;
}

export const usePdfContentExtraction = ({ document, onContentUpdate }: UsePdfContentExtractionProps) => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize extracted content
  useEffect(() => {
    if (document.extracted_content) {
      setExtractedText(document.extracted_content);
    }
  }, [document.extracted_content]);

  // Function to save modified content
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
      // Save extracted content to database
      const { error } = await supabase
        .from('medical_documents')
        .update({ extracted_content: extractedText })
        .eq('id', document.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde du contenu extrait:', error);
        throw error;
      }

      // Notify parent of new content
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

  // Function to start editing with default text
  const startPasting = () => {
    const defaultText = `Contenu extrait de ${document.file_name}

[Collez ici le texte que vous avez copié du PDF ci-dessus]

Instructions :
1. Ouvrez le PDF ci-dessus
2. Sélectionnez et copiez le texte important (Ctrl+C)
3. Collez le texte ici (Ctrl+V)
4. Modifiez si nécessaire
5. Cliquez sur "Sauvegarder"`;

    setExtractedText(defaultText);
    setIsEditing(true);
  };

  return {
    extractedText,
    setExtractedText,
    isEditing,
    setIsEditing,
    isSaving,
    saveExtractedContent,
    startPasting
  };
};
