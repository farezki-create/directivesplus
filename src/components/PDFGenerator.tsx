
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { DirectivePDFGenerator } from "./pdf/generators/DirectivePDFGenerator";
import { AccessCardGenerator } from "./pdf/generators/AccessCardGenerator";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  isCard?: boolean;
}

export function PDFGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  isCard = false
}: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const { responses, synthesis, isLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  if (loading || isLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  // Use the final synthesis text (passed or from database)
  const finalSynthesisText = synthesisText || synthesis?.free_text || "";

  if (isCard) {
    return (
      <AccessCardGenerator
        userId={userId}
        onPdfGenerated={onPdfGenerated}
        synthesisText={finalSynthesisText}
        profile={profile}
        responses={responses}
      />
    );
  }

  return (
    <DirectivePDFGenerator
      userId={userId}
      onPdfGenerated={onPdfGenerated}
      synthesisText={finalSynthesisText}
      profile={profile}
      responses={responses}
      trustedPersons={trustedPersons || []}
    />
  );
}
