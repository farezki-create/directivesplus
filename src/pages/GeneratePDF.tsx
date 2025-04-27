
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { PDFGenerator } from "@/components/PDFGenerator";
import { PDFGenerationStatus } from "@/components/pdf/PDFGenerationStatus";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useSynthesis } from "@/hooks/useSynthesis";
import { FileText, CreditCard, ChevronRight } from "lucide-react";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";

export default function GeneratePDF() {
  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses("");
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { text: freeText } = useSynthesis(null);
  const {
    userId,
    generating,
    progress,
    stage,
    checkAuth,
    startGeneration,
    handleDirectiveGenerated,
    handleCardGenerated
  } = useGeneratePDF();

  const isLoading = responsesLoading || profileLoading;

  useEffect(() => {
    checkAuth();
  }, []);

  const handleBackToSummary = () => {
    window.history.back();
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Génération de documents</h2>
            <Button 
              variant="ghost" 
              onClick={handleBackToSummary}
              className="text-blue-500 hover:text-blue-700"
            >
              Retour à la saisie
            </Button>
          </div>

          <Card className="p-6">
            <p className="text-gray-600 mb-4">
              Vos documents sont prêts à être générés. Cliquez sur le bouton ci-dessous pour créer vos documents PDF.
            </p>
            
            <PDFGenerationStatus stage={stage} progress={progress} />
            
            {!isLoading && !generating && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Documents à générer</h3>
                <Button
                  onClick={startGeneration}
                  disabled={generating}
                  className="flex items-center gap-2 w-full justify-center py-6"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span>Générer Mes directives anticipées et Ma carte d'accès</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      {stage === "generating-directive" && (
        <div className="hidden">
          <PDFGenerator 
            userId={userId} 
            onPdfGenerated={handleDirectiveGenerated}
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={false}
          />
        </div>
      )}
      
      {stage === "generating-card" && (
        <div className="hidden">
          <PDFGenerator 
            userId={userId} 
            onPdfGenerated={handleCardGenerated}
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={true}
          />
        </div>
      )}
    </div>
  );
}
