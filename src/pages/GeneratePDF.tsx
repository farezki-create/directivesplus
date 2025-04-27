
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PDFGenerator as FullPDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSynthesis } from "@/hooks/useSynthesis";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, CreditCard } from "lucide-react";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("directives");

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="directives" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Directives anticipées
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Carte d'accès
                </TabsTrigger>
              </TabsList>

              <TabsContent value="directives">
                <p className="text-gray-600 mb-4">
                  Voici vos directives anticipées prêtes à être générées. Cliquez sur le bouton ci-dessous pour créer votre document PDF.
                </p>
                {!isLoading && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Document principal</h3>
                    <FullPDFGenerator 
                      userId={userId} 
                      onPdfGenerated={setPdfUrl} 
                      synthesisText={freeText || synthesis?.free_text || ""}
                      isCard={false}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="card">
                <p className="text-gray-600 mb-4">
                  Voici votre carte d'accès prête à être générée. Cliquez sur le bouton ci-dessous pour créer votre carte au format PDF.
                </p>
                {!isLoading && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Carte d'accès</h3>
                    <FullPDFGenerator 
                      userId={userId} 
                      onPdfGenerated={setPdfUrl} 
                      synthesisText={freeText || synthesis?.free_text || ""}
                      isCard={true}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
