
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
import { FileText, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { PDFGenerationOverlay } from "@/components/pdf/PDFGenerationOverlay";
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
  const [processingStep, setProcessingStep] = useState<
    "idle" | "generating-directive" | "saving-directive" | "generating-card" | "saving-card" | "complete"
  >("idle");

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

  const saveToDocuments = async (pdfDataUrl: string, isCard: boolean): Promise<string | null> => {
    if (!profile || !userId) {
      toast({
        title: "Erreur",
        description: "Profil utilisateur non disponible",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const stepName = isCard ? "Sauvegarde de la carte d'accès" : "Sauvegarde des directives anticipées";
      console.log(`[GeneratePDF] ${stepName} en cours...`);
      
      const documentId = await PDFStorageService.uploadToCloud(
        pdfDataUrl,
        userId,
        profile
      );
      
      if (documentId) {
        console.log(`[GeneratePDF] ${stepName} réussie avec ID: ${documentId}`);
        toast({
          title: "Document sauvegardé",
          description: isCard ? "Votre carte d'accès a été sauvegardée" : "Vos directives anticipées ont été sauvegardées"
        });
        return documentId;
      } else {
        console.error(`[GeneratePDF] Échec de ${stepName.toLowerCase()}`);
        return null;
      }
    } catch (error) {
      console.error(`[GeneratePDF] Erreur lors de la sauvegarde ${isCard ? "de la carte" : "des directives"}:`, error);
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de sauvegarder ${isCard ? "la carte d'accès" : "les directives anticipées"}`,
        variant: "destructive"
      });
      return null;
    }
  };

  // Étape 1: Génération des directives anticipées
  const startDirectiveGeneration = () => {
    if (!userId || !profile || generating) return;
    
    console.log("[GeneratePDF] Début du processus de génération");
    setGenerating(true);
    setProcessingStep("generating-directive");
    setProgress(5);
    
    setTimeout(() => setProgress(10), 300);
    setTimeout(() => setProgress(15), 800);
  };

  // Étape 2: Sauvegarde des directives et démarrage de la génération de la carte
  const handleDirectiveGenerated = async (url: string | null) => {
    if (!url) {
      console.error("[GeneratePDF] Pas d'URL générée pour les directives");
      setGenerating(false);
      setProcessingStep("idle");
      toast({
        title: "Erreur",
        description: "La génération des directives anticipées a échoué",
        variant: "destructive"
      });
      return;
    }
    
    console.log("[GeneratePDF] Directives générées avec succès");
    setPdfUrls(prev => ({ ...prev, directive: url }));
    setProgress(25);
    setProcessingStep("saving-directive");
    
    // Sauvegarde des directives
    const directiveId = await saveToDocuments(url, false);
    setProgress(40);
    
    if (!directiveId) {
      console.warn("[GeneratePDF] Sauvegarde des directives échouée mais on continue");
      // On continue quand même avec la génération de la carte
    }
    
    // Démarrer la génération de la carte
    console.log("[GeneratePDF] Démarrage de la génération de la carte");
    setProcessingStep("generating-card");
    setProgress(50);
  };

  // Étape 3: Traitement de la carte générée
  const handleCardGenerated = async (url: string | null) => {
    if (!url) {
      console.error("[GeneratePDF] Pas d'URL générée pour la carte");
      setGenerating(false);
      setProcessingStep("idle");
      toast({
        title: "Erreur",
        description: "La génération de la carte d'accès a échoué",
        variant: "destructive"
      });
      return;
    }
    
    console.log("[GeneratePDF] Carte générée avec succès");
    setPdfUrls(prev => ({ ...prev, card: url }));
    setProgress(75);
    setProcessingStep("saving-card");
    
    // Sauvegarde de la carte
    const cardId = await saveToDocuments(url, true);
    setProgress(90);
    
    if (!cardId) {
      console.warn("[GeneratePDF] Sauvegarde de la carte échouée mais on finalise");
      // On finalise quand même le processus
    }
    
    // Finalisation du processus
    setProgress(100);
    setProcessingStep("complete");
    
    setTimeout(() => {
      console.log("[GeneratePDF] Processus complet, redirection vers les documents");
      setGenerating(false);
      setProcessingStep("idle");
      setProgress(0);
      navigate("/my-documents");
    }, 1000);
  };

  const generateAllDocuments = () => {
    if (generating || !userId || !profile) return;
    startDirectiveGeneration();
  };

  const getCurrentStatusMessage = () => {
    switch (processingStep) {
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
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
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
                  onClick={generateAllDocuments}
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

      {/* Composants PDF Generator invisibles utilisés pour la génération */}
      {processingStep === "generating-directive" && (
        <div className="hidden">
          <FullPDFGenerator 
            userId={userId} 
            onPdfGenerated={handleDirectiveGenerated}
            synthesisText={freeText || synthesis?.free_text || ""}
            isCard={false}
          />
        </div>
      )}
      
      {processingStep === "generating-card" && (
        <div className="hidden">
          <FullPDFGenerator 
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
