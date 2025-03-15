
import { useState } from 'react';
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { toast } from "@/hooks/use-toast";
import { TextDocumentGenerator } from "../utils/TextDocumentGenerator";

export function usePDFGeneration(userId: string) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { responses, synthesis } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generateTextDocument = () => {
    console.log("[PDFGenerator] Generating text document");
    setIsGenerating(true);
    setTextContent(null);
    
    try {
      // Generate the text document
      const textDoc = TextDocumentGenerator.generate(
        profile,
        responses,
        synthesis,
        trustedPersons
      );
      
      // Store the text content
      setTextContent(textDoc);
      
      // Show preview
      setShowPreview(true);
      
      // Success notification
      toast({
        title: "Succès",
        description: "Le document texte a été généré avec succès.",
      });
      
    } catch (error) {
      console.error("[PDFGenerator] Error generating text document:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du document texte.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    textContent,
    showPreview,
    setShowPreview,
    isGenerating,
    generateTextDocument,
    loading
  };
}
