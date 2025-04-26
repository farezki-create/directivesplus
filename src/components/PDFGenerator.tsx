
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { PDFMainGenerator } from "./pdf/PDFMainGenerator";
import { useState } from "react";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  isCard?: boolean;
}

export function PDFGenerator({ userId, onPdfGenerated, synthesisText, isCard }: PDFGeneratorProps) {
  const [generationState, setGenerationState] = useState<'idle' | 'generating' | 'completed'>('idle');
  
  console.log("[PDFGenerator] Initializing with userId:", userId);
  console.log("[PDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");
  console.log("[PDFGenerator] Generating card format:", isCard ? "Yes" : "No");
  
  const { responses, synthesis, isLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading || isLoading,
    synthesisText: synthesisText ? "Provided" : "Not provided",
    dbSynthesis: synthesis?.free_text ? "Available" : "Not available",
    generationState
  });

  if (loading || isLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  return (
    <PDFMainGenerator
      userId={userId}
      onPdfGenerated={(url) => {
        setGenerationState('completed');
        if (onPdfGenerated) {
          onPdfGenerated(url);
        }
      }}
      synthesisText={synthesisText}
      profile={profile}
      responses={responses}
      trustedPersons={trustedPersons}
      synthesis={synthesis}
      isCard={isCard}
      onGenerationStart={() => setGenerationState('generating')}
      generationState={generationState}
    />
  );
}
