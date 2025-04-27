
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFGenerator } from "@/components/PDFGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "@/components/pdf/usePDFData";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { useSynthesis } from "@/hooks/useSynthesis";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PDFStorageService } from "@/utils/storage/PDFStorageService";
import { toast } from "@/components/ui/use-toast";

export default function GeneratePDF() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{directive: string | null, card: string | null}>({
    directive: null,
    card: null
  });
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<
    "idle" | "generating-directive" | "saving-directive" | "generating-card" | "saving-card" | "complete"
  >("idle");

  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId || "");
  const { text: freeText } = useSynthesis(userId);
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();

  const isLoading = responsesLoading || profileLoading;

  // Check authentication
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

  // Save PDF to documents
  const saveDocument = async (pdfUrl: string | null, isCard: boolean): Promise<string | null> => {
    if (!pdfUrl || !profile || !userId) {
      console.error(`[GeneratePDF] Cannot save ${isCard ? "card" : "directive"}: missing data`);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder ${isCard ? "la carte" : "les directives"}. Données manquantes.`,
        variant: "destructive"
      });
      return null;
    }
    
    try {
      console.log(`[GeneratePDF] Saving ${isCard ? "card" : "directive"} to documents...`);
      const documentId = await PDFStorageService.uploadToCloud(pdfUrl, userId, profile);
      
      if (documentId) {
        console.log(`[GeneratePDF] Successfully saved ${isCard ? "card" : "directive"} with ID: ${documentId}`);
        toast({
          title: "Sauvegarde réussie",
          description: isCard 
            ? "Votre carte d'accès a été sauvegardée" 
            : "Vos directives anticipées ont été sauvegardées"
        });
        return documentId;
      } else {
        console.error(`[GeneratePDF] Failed to save ${isCard ? "card" : "directive"}`);
        toast({
          title: "Erreur de sauvegarde",
          description: `Impossible de sauvegarder ${isCard ? "la carte" : "les directives"}`,
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error(`[GeneratePDF] Error saving ${isCard ? "card" : "directive"}:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: `Une erreur est survenue lors de la sauvegarde ${isCard ? "de la carte" : "des directives"}`,
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle the directive PDF generation complete event
  const handleDirectiveGenerated = async (url: string | null) => {
    console.log("[GeneratePDF] Directive generation completed, URL received:", url ? "Yes" : "No");
    
    if (!url) {
      console.error("[GeneratePDF] Directive generation failed - no URL returned");
      toast({
        title: "Erreur",
        description: "La génération des directives anticipées a échoué",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    // Store the URL
    setPdfUrls(prev => ({ ...prev, directive: url }));
    setProgress(25);
    setStage("saving-directive");
    
    // Save the directive document
    console.log("[GeneratePDF] Saving directive document...");
    const directiveId = await saveDocument(url, false);
    
    if (!directiveId) {
      console.error("[GeneratePDF] Failed to save directive document");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les directives anticipées",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    // Move to card generation
    setProgress(50);
    setStage("generating-card");
    console.log("[GeneratePDF] Starting card generation...");
  };

  // Handle the card PDF generation complete event
  const handleCardGenerated = async (url: string | null) => {
    console.log("[GeneratePDF] Card generation completed, URL received:", url ? "Yes" : "No");
    
    if (!url) {
      console.error("[GeneratePDF] Card generation failed - no URL returned");
      toast({
        title: "Erreur",
        description: "La génération de la carte d'accès a échoué",
        variant: "destructive"
      });
      setGenerating(false);
      setStage("idle");
      return;
    }
    
    // Store the URL
    setPdfUrls(prev => ({ ...prev, card: url }));
    setProgress(75);
    setStage("saving-card");
    
    // Save the card document
    console.log("[GeneratePDF] Saving card document...");
    const cardId = await saveDocument(url, true);
    
    if (!cardId) {
      console.error("[GeneratePDF] Failed to save card document");
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la carte d'accès",
        variant: "destructive"
      });
    }
    
    // Complete the process
    setProgress(100);
    setStage("complete");
    
    // Redirect to documents after a short delay
    setTimeout(() => {
      console.log("[GeneratePDF] Process complete, redirecting to documents page");
      toast({
        title: "Génération terminée",
        description: "Vos documents ont été générés et sauvegardés avec succès"
      });
      setGenerating(false);
      navigate("/my-documents");
    }, 1500);
  };

  // Start generation process
  const startGeneration = () => {
    if (!userId || !profile || generating) return;
    
    console.log("[GeneratePDF] Starting document generation process");
    setGenerating(true);
    setStage("generating-directive");
    setProgress(5);
    
    // Update progress to show it's working
    setTimeout(() => setProgress(10), 300);
    setTimeout(() => setProgress(15), 800);
  };

  // Get current status message based on stage
  const getCurrentStatusMessage = () => {
    switch (stage) {
      case "generating-directive":
        return "Génération de vos directives anticipées en cours...";
      case "saving-directive":
        return "Sauvegarde de vos directives anticipées...";
      case "generating-card":
        return "Génération de votre carte d'accès en cours...";
      case "saving-card":
        return "Sauvegarde de votre carte d'accès...";
      case "complete":
        return "Finalisation et redirection vers vos documents...";
      default:
        return "";
    }
  };

  // Render loading state or redirect if not authenticated
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
              <div className="border rounded-lg p-4 mb-6 bg-gray-50">
                <div className="space-y-4">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-gray-600">{getCurrentStatusMessage()}</span>
                  </div>
                </div>
              </div>
            )}

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

      {/* PDFGenerator components - only render when needed */}
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
