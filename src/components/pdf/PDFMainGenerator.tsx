
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
    currentWaitingMessage,
    errorCount, setErrorCount
  } = usePDFGenerationState();

  // Effect to update local state when external generation state changes
  useEffect(() => {
    if (generationState === 'generating' && !isGenerating) {
      setIsGenerating(true);
    } else if (generationState === 'idle' && isGenerating) {
      setIsGenerating(false);
    }
  }, [generationState, isGenerating, setIsGenerating]);

  // Safety timeout to prevent getting stuck in generating state
  useEffect(() => {
    let safetyTimeout: NodeJS.Timeout | null = null;
    
    if (isGenerating) {
      safetyTimeout = setTimeout(() => {
        console.log("[PDFMainGenerator] Safety timeout triggered - generation taking too long");
        if (!pdfUrl) {
          // Afficher un toast d'information
          toast({
            title: "Génération prolongée",
            description: "La génération prend plus de temps que prévu, veuillez patienter...",
          });
          setProgress(95); // Show near completion
        }
      }, 20000); // 20 secondes - timeout réduit pour une meilleure réactivité
      
      // Second safety timeout (force completion)
      const forceCompletionTimeout = setTimeout(() => {
        if (isGenerating && !pdfUrl) {
          console.log("[PDFMainGenerator] Force timeout triggered - resetting generation state");
          setIsGenerating(false);
          setErrorCount(prev => prev + 1);
          
          toast({
            title: "Problème de génération",
            description: "La génération a pris trop de temps. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }, 30000); // 30 secondes maximum
      
      return () => {
        if (safetyTimeout) clearTimeout(safetyTimeout);
        clearTimeout(forceCompletionTimeout);
      };
    }
    
    return undefined;
  }, [isGenerating, pdfUrl, setProgress, toast, setErrorCount, setIsGenerating]);

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
      
      // Démarrer la génération plus rapidement
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
              
              // Save with the correct format designation
              const saveFormat = isCard ? 'card' : 'full';
              
              // Redirection automatique après génération réussie
              toast({
                title: "Succès",
                description: isCard 
                  ? "Votre carte d'accès a été générée et sauvegardée. Redirection vers vos documents..." 
                  : "Vos directives ont été générées et sauvegardées. Redirection vers vos documents...",
              });
              
              // Courte attente avant redirection pour montrer le message de succès
              setTimeout(() => {
                navigate("/my-documents");
              }, 2000);
            },
            setShowPreview,
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
      }, 300); // Démarrer après 300ms au lieu de 500ms
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
