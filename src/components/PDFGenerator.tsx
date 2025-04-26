
import { Button } from "@/components/ui/button";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { PDFMainGenerator } from "./pdf/PDFMainGenerator";
import { Card } from "./ui/card";
import { FileText, Ticket } from "lucide-react";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  isCard?: boolean;
}

export function PDFGenerator({ userId, onPdfGenerated, synthesisText, isCard }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  console.log("[PDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");
  console.log("[PDFGenerator] Generating card format:", isCard ? "Yes" : "No");
  
  const { responses, synthesis, isLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const navigateToCardGeneration = () => {
    window.location.href = "/generate-pdf?format=card";
  };

  if (loading || isLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Button 
            onClick={() => window.location.href = "/generate-pdf"}
            className="flex items-center gap-2"
            size="lg"
          >
            <FileText className="h-5 w-5" />
            Générer mes directives
          </Button>
          
          <Button 
            onClick={navigateToCardGeneration}
            variant="secondary"
            className="flex items-center gap-2"
            size="lg"
          >
            <Ticket className="h-5 w-5" />
            Générer ma carte d'accès
          </Button>
        </div>
      </Card>

      {isCard !== undefined && (
        <PDFMainGenerator
          userId={userId}
          onPdfGenerated={onPdfGenerated}
          synthesisText={synthesisText}
          profile={profile}
          responses={responses}
          trustedPersons={trustedPersons}
          synthesis={synthesis}
          isCard={isCard}
        />
      )}
    </div>
  );
}

