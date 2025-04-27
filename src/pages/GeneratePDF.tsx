
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator as FullPDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSynthesis } from "@/hooks/useSynthesis";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFGenerationOverlay } from "@/components/pdf/PDFGenerationOverlay";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();

  const isLoading = responsesLoading || profileLoading;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const handleBackToSummary = () => {
    navigate("/");
  };

  const generateAllDocuments = async () => {
    if (!userId || generating) return;
    
    setGenerating(true);
    setProgress(0);
    
    try {
      // Generate directives first
      await new Promise((resolve) => {
        setProgress(25);
        const directives = (
          <FullPDFGenerator 
            userId={userId} 
            onPdfGenerated={(url) => {
              setPdfUrl(url);
              setProgress(50);
              resolve(true);
            }} 
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={false}
          />
        );
      });

      // Then generate card
      await new Promise((resolve) => {
        setProgress(75);
        const card = (
          <FullPDFGenerator 
            userId={userId} 
            onPdfGenerated={(url) => {
              setPdfUrl(url);
              setProgress(100);
              resolve(true);
            }} 
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={true}
          />
        );
      });
    } finally {
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
      }, 1000);
    }
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
            
            {generating && (
              <PDFGenerationOverlay
                isGenerating={generating}
                progress={progress}
                isCard={progress >= 50}
              />
            )}

            {!isLoading && !generating && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Documents à générer</h3>
                <Button
                  onClick={generateAllDocuments}
                  disabled={generating}
                  className="flex items-center gap-2 w-full justify-center py-6"
                >
                  <FileText className="h-5 w-5" />
                  <span>Générer Mes directives anticipées et Ma carte d'accès</span>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
