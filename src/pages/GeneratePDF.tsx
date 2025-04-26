
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
import { toast } from "@/hooks/use-toast";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCard, setIsCard] = useState(false);
  
  // Check if this is a card generation based on URL search params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const cardParam = searchParams.get('format');
    setIsCard(cardParam === 'card');
  }, []);
  
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
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour générer vos directives.",
          variant: "destructive",
        });
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

  const handlePdfGenerated = (url: string | null) => {
    setPdfUrl(url);
    if (url) {
      toast({
        title: "Succès",
        description: isCard 
          ? "Votre carte d'accès a été générée. Vous serez redirigé vers vos documents."
          : "Vos directives ont été générées. Vous serez redirigé vers vos documents.",
      });
      
      setTimeout(() => {
        navigate("/my-documents");
      }, 2000);
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
            <h2 className="text-2xl font-bold">
              {isCard ? "Génération de ma carte d'accès" : "Génération de mes directives anticipées"}
            </h2>
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
                {isCard 
                  ? "Voici votre carte d'accès prête à être générée. Cliquez sur le bouton ci-dessous pour créer votre carte au format PDF."
                  : "Voici vos directives anticipées prêtes à être générées. Cliquez sur le bouton ci-dessous pour créer votre document PDF."
                }
              </p>
            </div>
            
            {!isLoading && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {isCard ? "Carte d'accès" : "Document principal"}
                </h3>
                <FullPDFGenerator 
                  userId={userId} 
                  onPdfGenerated={handlePdfGenerated} 
                  synthesisText={freeText || synthesis?.free_text || ""}
                  isCard={isCard}
                />
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
