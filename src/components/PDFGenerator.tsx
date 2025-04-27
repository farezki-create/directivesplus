
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { PDFMainGenerator } from "./pdf/PDFMainGenerator";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  console.log("[PDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");
  console.log("[PDFGenerator] Generating card format:", isCard ? "Yes" : "No");
  const {
    responses,
    synthesis,
    isLoading
  } = useQuestionnairesResponses(userId);
  const {
    profile,
    trustedPersons,
    loading
  } = usePDFData();
  const navigate = useNavigate();

  // If we're in a context where we just need to show the buttons
  if (!onPdfGenerated) {
    // Return the PDF navigation buttons
    const navigateToPDFGeneration = (isCard: boolean = false) => {
      const url = isCard ? "/generate-pdf?format=card" : "/generate-pdf";
      navigate(url);
    };
    return <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button 
          onClick={() => navigateToPDFGeneration(false)} 
          className="flex items-center gap-3 h-auto py-4 w-full transition-all 
            transform hover:scale-[1.02] hover:shadow-lg 
            bg-gradient-to-r from-blue-500 to-blue-600 
            text-white hover:from-blue-600 hover:to-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-300 
            rounded-xl duration-300 ease-in-out"
        >
          <div className="bg-white/20 p-2 rounded-full">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="text-left flex-grow">
            <div className="font-medium text-sm sm:text-base">
              Générer mes directives anticipées et ma carte d'accès
            </div>
          </div>
        </Button>
      </div>;
  }
  if (loading || isLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }
  return <PDFMainGenerator userId={userId} onPdfGenerated={onPdfGenerated} synthesisText={synthesisText} profile={profile} responses={responses} trustedPersons={trustedPersons} synthesis={synthesis} isCard={isCard} />;
}
