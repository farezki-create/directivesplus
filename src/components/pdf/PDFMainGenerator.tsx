
import { useState, useEffect } from "react";
import { PDFGenerationButtons } from "./PDFGenerationButtons";
import { PDFGeneratorStatus } from "./PDFGeneratorStatus";
import { usePDFGenerationState } from "./usePDFGenerationState";
import { PDFGenerationSafetyTimeout } from "./components/PDFGenerationSafetyTimeout";
import { usePDFGeneration } from "./hooks/usePDFGeneration";
import { UserProfile, TrustedPerson } from "./types";

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
    onPdfGenerated,
    onGenerationStart,
    profile,
    responses,
    trustedPersons,
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
    </>
  );
}
