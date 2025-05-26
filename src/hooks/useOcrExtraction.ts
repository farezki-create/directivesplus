
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import Tesseract from 'tesseract.js';

export const useOcrExtraction = (extractedText: string, setExtractedText: (text: string) => void) => {
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setIsOcrProcessing(true);
    toast({
      title: "Analyse en cours",
      description: "Extraction du texte de l'image..."
    });

    try {
      const result = await Tesseract.recognize(file, 'fra', {
        logger: m => console.log(m)
      });
      
      const extractedOcrText = result.data.text;
      if (extractedOcrText.trim()) {
        setExtractedText(extractedText + '\n\n' + extractedOcrText);
        toast({
          title: "Texte extrait avec succès",
          description: "Le texte de l'image a été ajouté"
        });
      } else {
        toast({
          title: "Aucun texte détecté",
          description: "Aucun texte n'a pu être extrait de cette image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur OCR:', error);
      toast({
        title: "Erreur d'extraction",
        description: "Impossible d'extraire le texte de l'image",
        variant: "destructive"
      });
    } finally {
      setIsOcrProcessing(false);
    }
  };

  return {
    isOcrProcessing,
    handleImageUpload
  };
};
