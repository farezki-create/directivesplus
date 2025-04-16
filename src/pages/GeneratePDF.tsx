
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator as FullPDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSynthesis } from "@/hooks/useSynthesis";
import { PDFCardGenerator } from "@/components/pdf/utils/PDFCardGenerator";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText } from "lucide-react";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [cardPdfUrl, setCardPdfUrl] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
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
      
      // Ensure we have the free text synthesis from the database
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

  const handleGenerateCard = async () => {
    if (!profile || !userId) {
      toast({
        title: "Erreur",
        description: "Informations de profil incomplètes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGeneratingCard(true);
      // Ensure unique_identifier is set
      const profileWithId = {
        ...profile,
        unique_identifier: userId
      };
      
      const cardUrl = await PDFCardGenerator.generate(profileWithId, trustedPersons);
      setCardPdfUrl(cardUrl);
      
      toast({
        title: "Succès",
        description: "Carte format bancaire générée avec succès",
      });
    } catch (error) {
      console.error("[GeneratePDF] Error generating card:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la carte format bancaire",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleDownloadCard = () => {
    if (cardPdfUrl) {
      const link = document.createElement('a');
      link.href = cardPdfUrl;
      link.download = 'carte-directives-anticipees.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Document principal</h3>
                  <FullPDFGenerator 
                    userId={userId} 
                    onPdfGenerated={setPdfUrl} 
                    synthesisText={freeText || synthesis?.free_text || ""}
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Carte format bancaire</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Générez une carte au format bancaire contenant vos informations principales pour un accès facile à vos directives.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={handleGenerateCard} 
                      disabled={isGeneratingCard}
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {isGeneratingCard ? 'Génération...' : 'Générer la carte'}
                    </Button>
                    
                    {cardPdfUrl && (
                      <Button
                        onClick={handleDownloadCard}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Télécharger la carte
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
