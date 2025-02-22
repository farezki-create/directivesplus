
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[PDFGenerator] Starting PDF generation with userId:", userId);
    
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
    return null;
  }

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
      
      {/* Force a new instance of PDFPreviewDialog when pdfUrl changes */}
      {showPreview && (
        <PDFPreviewDialog
          key={pdfUrl}
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={pdfUrl}
          onEmail={handleEmail}
          onSave={() => handlePDFDownload(pdfUrl)}
          onPrint={() => handlePDFPrint(pdfUrl)}
        />
      )}
    </>
  );
}
