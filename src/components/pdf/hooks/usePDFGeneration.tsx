
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { UserProfile, TrustedPerson } from "../types";
import { toast } from "@/hooks/use-toast";
import { savePDFToStorage } from "../utils/PDFGenerationUtils";

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

  const generatePDF = async () => {
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
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      
      setTimeout(async () => {
        try {
          // Generate PDF directly using PDFDocumentGenerator
          const pdfDataUrl = await PDFDocumentGenerator.generate(
            profile,
            {
              ...responses,
              synthesis: { free_text: finalSynthesisText }
            },
            trustedPersons,
            isCard
          );
          
          clearInterval(interval);
          console.log("[PDFGenerator] Generation complete, URL received:", !!pdfDataUrl);
          setProgress(100);
          setPdfUrl(pdfDataUrl);
          
          if (onPdfGenerated) {
            onPdfGenerated(pdfDataUrl);
          }
          
          setIsGenerating(false);
          
          toast({
            title: "Succès",
            description: isCard 
              ? "Votre carte d'accès a été générée. Cliquez sur Prévisualiser pour la voir."
              : "Vos directives ont été générées. Cliquez sur Prévisualiser pour les voir.",
          });
        } catch (error) {
          clearInterval(interval);
          console.error("[PDFGenerator] Inner error during PDF generation:", error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la génération du PDF.",
            variant: "destructive",
          });
          setIsGenerating(false);
        }
      }, 1000);
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

  const saveToDocuments = async () => {
    if (!pdfUrl || !userId || !profile) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le document. Veuillez d'abord générer le PDF.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setProgress(50);
      
      // Save PDF to storage
      const saveResult = await savePDFToStorage(pdfUrl, userId, isCard);
      
      setIsGenerating(false);
      
      if (saveResult) {
        toast({
          title: "Sauvegarde réussie",
          description: "Votre document a été sauvegardé avec succès. Redirection vers vos documents...",
        });
        
        // Navigate to documents page after successful save
        setTimeout(() => {
          navigate("/my-documents");
        }, 1500);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder le document. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("[PDFGenerator] Error saving PDF:", error);
      setIsGenerating(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du PDF.",
        variant: "destructive",
      });
    }
  };

  return {
    isGenerating,
    progress,
    pdfUrl,
    generatePDF,
    saveToDocuments
  };
}
