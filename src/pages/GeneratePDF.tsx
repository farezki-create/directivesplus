
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator as FullPDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSynthesis } from "@/hooks/useSynthesis";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { directive, isLoading: directiveLoading, saveDirective } = useDirectives(userId || "");

  const isLoading = responsesLoading || profileLoading || directiveLoading;

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

  useEffect(() => {
    if (userId && responses && profile && !responsesLoading && !profileLoading) {
      console.log("[GeneratePDF] Saving directives");
      const synthesisContent = synthesis?.free_text || freeText || "";
      saveDirective.mutate({
        general: responses.general,
        lifeSupport: responses.lifeSupport,
        advancedIllness: responses.advancedIllness,
        preferences: responses.preferences,
        profile,
        trustedPersons,
        synthesis: { free_text: synthesisContent }
      });
    }
  }, [userId, responses, profile, responsesLoading, profileLoading, synthesis, freeText]);

  const handleBackToSummary = () => {
    navigate("/");
  };

  const generateAllDocuments = async () => {
    if (!userId || generating) return;
    
    setGenerating(true);
    try {
      // Generate directives first
      await new Promise((resolve) => {
        const directives = (
          <FullPDFGenerator 
            userId={userId} 
            onPdfGenerated={(url) => {
              setPdfUrl(url);
              resolve(true);
            }} 
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={false}
          />
        );
      });

      // Then generate card
      await new Promise((resolve) => {
        const card = (
          <FullPDFGenerator 
            userId={userId} 
            onPdfGenerated={(url) => {
              setPdfUrl(url);
              resolve(true);
            }} 
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={true}
          />
        );
      });
    } finally {
      setGenerating(false);
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
            {!isLoading && (
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
