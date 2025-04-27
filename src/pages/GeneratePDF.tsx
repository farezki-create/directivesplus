
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
import { FileText, CreditCard } from "lucide-react";
import { PDFGenerationOverlay } from "@/components/pdf/PDFGenerationOverlay";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDocument, setCurrentDocument] = useState<"directive" | "card" | null>(null);

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

  const generateDirectiveDocument = () => {
    if (!userId || !profile) return;
    
    setCurrentDocument("directive");
    setProgress(0);
    
    // Simulate starting progress
    setTimeout(() => setProgress(10), 300);
    setTimeout(() => setProgress(20), 800);
    
    return (
      <FullPDFGenerator 
        userId={userId} 
        onPdfGenerated={(url) => {
          setPdfUrl(url);
          setProgress(50);
          generateCardDocument();
        }}
        synthesisText={freeText || synthesis?.free_text || ""}
        isCard={false}
      />
    );
  };
  
  const generateCardDocument = () => {
    if (!userId || !profile) return;
    
    setCurrentDocument("card");
    
    // Simulate continuing progress
    setTimeout(() => setProgress(60), 300);
    setTimeout(() => setProgress(70), 800);
    
    return (
      <FullPDFGenerator 
        userId={userId} 
        onPdfGenerated={(url) => {
          setPdfUrl(url);
          setProgress(100);
          
          // Complete the process after a short delay
          setTimeout(() => {
            setGenerating(false);
            setProgress(0);
            setCurrentDocument(null);
          }, 1000);
        }}
        synthesisText={freeText || synthesis?.free_text || ""}
        isCard={true}
      />
    );
  };

  const generateAllDocuments = async () => {
    if (!userId || generating) return;
    
    setGenerating(true);
    generateDirectiveDocument();
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
                isCard={currentDocument === "card"}
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
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CreditCard className="h-5 w-5" />
                  </div>
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
