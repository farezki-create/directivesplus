
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./pdf/utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFCardGenerator } from "./pdf/utils/PDFCardGenerator";
import { toast } from "@/hooks/use-toast";

interface PDFGeneratorProps {
  userId: string;
  isCardFormat?: boolean;
}

export function PDFGenerator({ userId, isCardFormat = false }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId, "isCardFormat:", isCardFormat);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isCardFormat) {
        console.log("[PDFGenerator] Generating card format PDF");
        const pdfDataUrl = PDFCardGenerator.generate(profile, trustedPersons);
        console.log("[PDFGenerator] Card PDF generated, setting URL and opening preview");
        setPdfUrl(pdfDataUrl);
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
            setShowPreview(true);
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
      <Button 
        onClick={generatePDF}
        className="flex items-center gap-2"
        variant={isCardFormat ? "outline" : "default"}
      >
        <FileText className="h-4 w-4" />
        {isCardFormat ? "Générer au format carte" : "Générer Mes directives anticipées"}
      </Button>
      
      {showPreview && (
        <PDFPreviewDialog
          key={pdfUrl}
          open={showPreview}
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
