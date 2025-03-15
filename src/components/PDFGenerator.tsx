
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, savePDFToStorage } from "./pdf/utils/PDFGenerationUtils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
}

const waitingMessages = [
  "Préparation de votre document avec soin... 📝",
  "Mise en page de vos directives... 📄",
  "Ajout d'une touche de professionnalisme... ✨",
  "Finalisation des derniers détails... 🎯",
  "Vérification de la mise en forme... 🔍",
  "Assemblage de vos informations... 📋",
  "Plus que quelques secondes... ⏳",
  "Votre document est presque prêt... 🌟",
];

export function PDFGenerator({ userId, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Debug logs to track component state
  useEffect(() => {
    console.log("[PDFGenerator] Current state:", {
      hasProfile: !!profile,
      hasTrustedPersons: trustedPersons.length,
      hasResponses: !!responses,
      isLoading: loading,
      showPreview,
      hasPdfUrl: !!pdfUrl
    });
    
    if (pdfUrl) {
      console.log("[PDFGenerator] PDF URL type:", typeof pdfUrl);
      console.log("[PDFGenerator] PDF URL starts with:", pdfUrl.substring(0, 20) + "...");
    }
  }, [profile, trustedPersons, responses, loading, showPreview, pdfUrl]);

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setGenerationError(null);
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      handlePDFGeneration(
        profile,
        responses,
        trustedPersons,
        (url) => {
          console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
          if (!url) {
            console.error("[PDFGenerator] PDF generation failed - no URL returned");
            setGenerationError("La génération du PDF a échoué. Veuillez réessayer.");
            toast({
              title: "Erreur",
              description: "La génération du PDF a échoué. Veuillez réessayer.",
              variant: "destructive",
            });
            setIsGenerating(false);
            return;
          }
          
          // Store the PDF URL in localStorage as a backup
          try {
            localStorage.setItem(`pdf_${userId}`, url);
            console.log("[PDFGenerator] PDF URL saved to localStorage");
          } catch (e) {
            console.warn("[PDFGenerator] Could not save PDF to localStorage:", e);
          }
          
          setPdfUrl(url);
          if (onPdfGenerated) {
            onPdfGenerated(url);
          }
          setIsGenerating(false);
        },
        setShowPreview
      );
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      setGenerationError("Une erreur est survenue lors de la génération du PDF.");
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  if (loading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering buttons");
  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-sm p-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium text-foreground animate-pulse">
              {waitingMessages[currentMessageIndex]}
            </p>
          </div>
        </div>
      )}
      
      {generationError && (
        <div className="text-red-500 bg-red-50 p-3 rounded-md mb-3">
          {generationError}
        </div>
      )}
      
      <Button 
        onClick={generatePDF}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      {showPreview && (
        <PDFPreviewDialog
          key={`pdf-preview-${Date.now()}`} // Force re-render with a unique key
          open={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          onSave={() => handlePDFDownload(pdfUrl)}
        />
      )}
    </>
  );
}
