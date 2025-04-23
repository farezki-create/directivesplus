
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

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { directive, isLoading: directiveLoading, saveDirective } = useDirectives(userId || "");

  // Combine all loading states
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

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Génération de mes directives anticipées</h2>
            <button 
              onClick={() => navigate("/free-text")}
              className="text-blue-500 hover:text-blue-700"
            >
              Retour à la saisie
            </button>
          </div>

          <Card className="p-6">
            <div className="flex gap-4 flex-wrap mb-6">
              <p className="text-gray-600 mb-4">
                Voici vos directives anticipées prêtes à être générées. Cliquez sur le bouton ci-dessous pour créer votre document PDF.
              </p>
            </div>
            
            {!isLoading && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Document principal</h3>
                <FullPDFGenerator 
                  userId={userId} 
                  onPdfGenerated={setPdfUrl} 
                  synthesisText={freeText || synthesis?.free_text || ""}
                />
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
