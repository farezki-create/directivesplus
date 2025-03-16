
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
import { CheckCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Vérification importante</AlertTitle>
                <AlertDescription>
                  Prenez le temps nécessaire pour vérifier que toutes vos informations sont complètes avant de générer le document final.
                  Un document complet doit inclure vos réponses aux questionnaires, votre texte libre et idéalement une personne de confiance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Éléments de vos directives anticipées :</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    {hasAnyResponses ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Réponses aux questionnaires</p>
                      <p className="text-sm text-muted-foreground">
                        {hasAnyResponses ? 
                          "Vos réponses aux questionnaires sont enregistrées." : 
                          "Vous n'avez pas encore répondu aux questionnaires."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    {hasFreeText ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Texte libre</p>
                      <p className="text-sm text-muted-foreground">
                        {hasFreeText ? 
                          "Vous avez rédigé un texte libre pour vos directives." : 
                          "Vous n'avez pas encore rédigé de texte libre pour vos directives."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    {hasTrustedPerson ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Personne de confiance</p>
                      <p className="text-sm text-muted-foreground">
                        {hasTrustedPerson ? 
                          "Vous avez désigné une personne de confiance." : 
                          "Vous n'avez pas encore désigné de personne de confiance."}
                      </p>
                    </div>
                  </div>
                </div>

                {!hasReviewed && (
                  <div className="pt-4">
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertTitle>Vérification requise</AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p>
                          Veuillez vérifier que toutes les informations ci-dessus sont complètes avant de continuer.
                          Si vous souhaitez compléter certaines sections, utilisez les liens suivants :
                        </p>
                        <div className="grid gap-2 pt-2">
                          <a href="/general-opinion" className="text-blue-600 hover:underline flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire d'opinion générale
                          </a>
                          <a href="/life-support" className="text-blue-600 hover:underline flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur le maintien en vie
                          </a>
                          <a href="/advanced-illness" className="text-blue-600 hover:underline flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur la maladie avancée
                          </a>
                          <a href="/preferences" className="text-blue-600 hover:underline flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Compléter le questionnaire sur vos préférences
                          </a>
                          <a href="/free-text" className="text-blue-600 hover:underline flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Compléter ou modifier votre texte libre
                          </a>
                        </div>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-end mt-4">
                      <button 
                        onClick={handleConfirmReview}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        J'ai vérifié mes informations
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {hasReviewed && !isLoading && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Générer mon document</h3>
                  <p className="text-gray-600">
                    Vos directives anticipées sont prêtes à être générées. Cliquez sur le bouton ci-dessous pour créer votre document PDF.
                  </p>
                  <FullPDFGenerator userId={userId} onPdfGenerated={setPdfUrl} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
