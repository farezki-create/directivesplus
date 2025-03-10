
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./pdf/utils/PDFGenerationUtils";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { PDFCardGenerator } from "./pdf/utils/PDFCardGenerator";
import { toast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  userId: string;
  isCardFormat?: boolean;
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

export function PDFGenerator({ userId, isCardFormat = false, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId, "isCardFormat:", isCardFormat);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
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

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    
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
      if (isCardFormat) {
        console.log("[PDFGenerator] Generating card format PDF");
        const pdfDataUrl = PDFCardGenerator.generate(profile, trustedPersons);
        console.log("[PDFGenerator] Card PDF generated, setting URL and opening preview");
        setPdfUrl(pdfDataUrl);
        if (onPdfGenerated) {
          onPdfGenerated(pdfDataUrl);
        }
        setShowPreview(true);
      } else {
        console.log("[PDFGenerator] Generating full PDF");
        handlePDFGeneration(
          profile,
          responses,
          trustedPersons,
          (url) => {
            console.log("[PDFGenerator] PDF generated, setting URL:", url ? "success" : "failed");
            setPdfUrl(url);
            if (onPdfGenerated) {
              onPdfGenerated(url);
            }
            setIsGenerating(false);
          },
          setShowPreview
        );
      }
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleEmail = async () => {
    toast({
      title: "Information",
      description: "L'envoi par email sera bientôt disponible",
    });
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
        variant={isCardFormat ? "outline" : "default"}
        disabled={isGenerating}
      >
        <FileText className="h-4 w-4" />
        {isCardFormat ? "Générer au format carte" : "Générer Mes directives anticipées"}
      </Button>
      
      {showPreview && (
        <PDFPreviewDialog
          isOpen={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          onEmail={handleEmail}
          onSave={() => handlePDFDownload(pdfUrl)}
          onPrint={() => handlePDFPrint(pdfUrl)}
        />
      )}
    </>
  );
}
