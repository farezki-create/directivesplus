
import { useEffect } from "react";
import { handlePDFGeneration } from "./utils/PDFGenerationUtils";
import { UserProfile, TrustedPerson } from "./types";
import { toast } from "@/hooks/use-toast";
import { PDFGenerationButtons } from "./PDFGenerationButtons";
import { PDFGeneratorStatus } from "./PDFGeneratorStatus";
import { usePDFGenerationState } from "./usePDFGenerationState";
import { useNavigate } from "react-router-dom";

interface PDFMainGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  profile: UserProfile | null;
  responses: any;
  trustedPersons: TrustedPerson[];
  synthesis?: { free_text: string } | null;
  isCard?: boolean;
  onGenerationStart?: () => void;
  generationState?: 'idle' | 'generating' | 'completed';
}

export function PDFMainGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  profile,
  responses,
  trustedPersons,
  synthesis,
  isCard,
  onGenerationStart,
  generationState = 'idle'
}: PDFMainGeneratorProps) {
  const navigate = useNavigate();
  const { 
    pdfUrl, setPdfUrl, 
    showPreview, setShowPreview,
    documentIdentifier, setDocumentIdentifier,
    isGenerating, setIsGenerating,
    progress, setProgress,
    currentWaitingMessage 
  } = usePDFGenerationState();

  // Effect to update local state when external generation state changes
  useEffect(() => {
    if (generationState === 'generating' && !isGenerating) {
      setIsGenerating(true);
    } else if (generationState === 'idle' && isGenerating) {
      setIsGenerating(false);
    }
  }, [generationState, isGenerating]);

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
      
      const finalSynthesisText = synthesisText || synthesis?.free_text || "";
      
      setTimeout(async () => {
        handlePDFGeneration(
          profile,
          {
            ...responses,
            synthesis: { free_text: finalSynthesisText }
          },
          trustedPersons,
          async (url) => {
            setProgress(100);
            setPdfUrl(url);
            if (onPdfGenerated) {
              onPdfGenerated(url);
            }
            setIsGenerating(false);
            
            // Save with the correct format designation
            const saveFormat = isCard ? 'card' : 'full';
            
            // Navigate to documents page after successful generation
            toast({
              title: "Succès",
              description: isCard 
                ? "Votre carte d'accès a été générée et sauvegardée. Redirection vers vos documents..." 
                : "Vos directives ont été générées et sauvegardées. Redirection vers vos documents...",
            });
            
            // Add a small delay before navigation to ensure the user sees the success message
            setTimeout(() => {
              navigate("/my-documents");
            }, 2000);
          },
          setShowPreview,
          isCard
        );
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

  return (
    <>
      <PDFGeneratorStatus
        isGenerating={isGenerating}
        progress={progress}
        currentWaitingMessage={currentWaitingMessage}
        profile={profile}
        pdfUrl={pdfUrl}
        responses={responses}
        synthesis={synthesis}
        isCard={isCard}
      />
      
      <PDFGenerationButtons 
        pdfUrl={pdfUrl}
        isGenerating={isGenerating}
        onGenerateClick={generatePDF}
        documentIdentifier={documentIdentifier}
        isCard={isCard}
      />
    </>
  );
}
