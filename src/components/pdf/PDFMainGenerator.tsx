
import { useState, useEffect } from "react";
import { PDFGenerationButtons } from "./PDFGenerationButtons";
import { PDFGeneratorStatus } from "./PDFGeneratorStatus";
import { usePDFGenerationState } from "./usePDFGenerationState";
import { PDFGenerationSafetyTimeout } from "./components/PDFGenerationSafetyTimeout";
import { usePDFGeneration } from "./hooks/usePDFGeneration";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { UserProfile, TrustedPerson } from "./types";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
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
  const [errorCount, setErrorCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  
  const { 
    currentWaitingMessage,
    setIsGenerating,
    documentIdentifier,
  } = usePDFGenerationState();

  const {
    isGenerating,
    progress,
    pdfUrl,
    generatePDF
  } = usePDFGeneration(
    userId,
    profile,
    responses,
    trustedPersons,
    onPdfGenerated,
    onGenerationStart,
    synthesisText,
    isCard
  );

  // Effect to sync with external generation state
  useEffect(() => {
    if (generationState === 'generating' && !isGenerating) {
      setIsGenerating(true);
    } else if (generationState === 'idle' && isGenerating) {
      setIsGenerating(false);
    }
  }, [generationState, isGenerating, setIsGenerating]);

  const handleSaveToDocuments = () => {
    setShowPreview(false);
    toast({
      title: "Succès",
      description: isCard 
        ? "Votre carte d'accès a été sauvegardée. Redirection vers vos documents..."
        : "Vos directives ont été sauvegardées. Redirection vers vos documents...",
    });
    setTimeout(() => {
      navigate("/my-documents");
    }, 1500);
  };

  return (
    <>
      <PDFGenerationSafetyTimeout
        isGenerating={isGenerating}
        pdfUrl={pdfUrl}
        setIsGenerating={setIsGenerating}
        setErrorCount={setErrorCount}
      />
      
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

      {pdfUrl && showPreview && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={pdfUrl}
        />
      )}

      {pdfUrl && !showPreview && (
        <div className="mt-4">
          <Button 
            onClick={handleSaveToDocuments}
            className="w-full"
            variant="secondary"
          >
            Sauvegarder dans mes documents
          </Button>
        </div>
      )}
    </>
  );
}
