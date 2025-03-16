
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { useDirectives } from "@/hooks/useDirectives";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { IntroSection } from "@/components/generate-pdf/IntroSection";
import { ReviewChecklist } from "@/components/generate-pdf/ReviewChecklist";
import { PDFGenerationSection } from "@/components/generate-pdf/PDFGenerationSection";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { directive, isLoading: directiveLoading, saveDirective } = useDirectives(userId || "");
  const [hasReviewed, setHasReviewed] = useState(false);

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
      saveDirective.mutate({
        general: responses.general,
        lifeSupport: responses.lifeSupport,
        advancedIllness: responses.advancedIllness,
        preferences: responses.preferences,
        profile,
        trustedPersons,
      });
    }
  }, [userId, responses, profile, responsesLoading, profileLoading]);

  // Check if we have all the necessary information
  const hasFreeText = synthesis?.free_text && synthesis.free_text.length > 0;
  const hasTrustedPerson = trustedPersons && trustedPersons.length > 0;
  const hasAnyResponses = responses && (
    (responses.general && responses.general.length > 0) ||
    (responses.lifeSupport && responses.lifeSupport.length > 0) ||
    (responses.advancedIllness && responses.advancedIllness.length > 0) ||
    (responses.preferences && responses.preferences.length > 0)
  );

  const handleConfirmReview = () => {
    setHasReviewed(true);
    toast({
      title: "Génération prête",
      description: "Vous pouvez maintenant générer vos directives anticipées",
    });
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
            <div className="space-y-6">
              <IntroSection />

              <ReviewChecklist 
                hasAnyResponses={hasAnyResponses}
                hasFreeText={hasFreeText}
                hasTrustedPerson={hasTrustedPerson}
                hasReviewed={hasReviewed}
                onConfirmReview={handleConfirmReview}
              />

              <PDFGenerationSection 
                userId={userId}
                hasReviewed={hasReviewed}
                isLoading={isLoading}
                onPdfGenerated={setPdfUrl}
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
