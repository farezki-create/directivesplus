
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
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
  const [generationFailed, setGenerationFailed] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  // Check if we have a cached PDF in localStorage
  useEffect(() => {
    if (userId && !pdfUrl) {
      try {
        const cachedPdf = localStorage.getItem(`pdf_${userId}`);
        if (cachedPdf && (cachedPdf.startsWith('data:') || cachedPdf.startsWith('http'))) {
          console.log("[PDFGenerator] Found cached PDF in localStorage");
          setPdfUrl(cachedPdf);
        }
      } catch (e) {
        console.warn("[PDFGenerator] Could not read from localStorage:", e);
      }
    }
  }, [userId, pdfUrl]);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % waitingMessages.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setGenerationFailed(false);
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
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
          
          // Display detailed error if no URL was returned
          if (!url) {
            setGenerationFailed(true);
            toast({
              title: "Erreur",
              description: "Impossible de générer le PDF. Veuillez vérifier votre connexion internet.",
              variant: "destructive",
            });
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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationFailed(true);
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
      
      <Button 
        onClick={generatePDF}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        {generationFailed ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Réessayer la génération
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Générer Mes directives anticipées
          </>
        )}
      </Button>
      
      {showPreview && (
        <PDFPreviewDialog
          key={`pdf-preview-${pdfUrl?.substring(0, 20)}`}
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
