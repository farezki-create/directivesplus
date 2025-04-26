
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handlePDFGeneration } from "../utils/PDFGenerationUtils";
import { UserProfile, TrustedPerson } from "../types";
import { toast } from "@/hooks/use-toast";

export function usePDFGeneration(
  userId: string,
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  onPdfGenerated?: (url: string | null) => void,
  onGenerationStart?: () => void,
  synthesisText?: string,
  isCard?: boolean
) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setProgress(10);
    
    if (onGenerationStart) {
      onGenerationStart();
    }
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating PDF", isCard ? "as card format" : "as full document");
      
      const finalSynthesisText = synthesisText || "";
      
      setTimeout(async () => {
        try {
          handlePDFGeneration(
            profile,
            {
              ...responses,
              synthesis: { free_text: finalSynthesisText }
            },
            trustedPersons,
            (url) => {
              console.log("[PDFGenerator] Generation complete, URL received:", !!url);
              setProgress(100);
              setPdfUrl(url);
              
              if (onPdfGenerated) {
                onPdfGenerated(url);
              }
              
              setIsGenerating(false);
              
              toast({
                title: "Succès",
                description: isCard 
                  ? "Votre carte d'accès a été générée. Cliquez sur Prévisualiser pour la voir."
                  : "Vos directives ont été générées. Cliquez sur Prévisualiser pour les voir.",
              });
            },
            (showPreview) => {
              // Cette fonction est appelée pour contrôler l'affichage de la prévisualisation
              console.log("[PDFGenerator] setShowPreview called:", showPreview);
            },
            isCard
          );
        } catch (error) {
          console.error("[PDFGenerator] Inner error during PDF generation:", error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération du PDF.",
            variant: "destructive",
          });
          setIsGenerating(false);
        }
      }, 100);
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    progress,
    pdfUrl,
    generatePDF
  };
}
