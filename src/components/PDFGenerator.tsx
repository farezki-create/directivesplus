
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./pdf/utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFCardGenerator } from "./pdf/utils/PDFCardGenerator";
import { toast } from "./ui/use-toast";

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
    console.log("[PDFGenerator] Starting PDF generation");
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles",
        variant: "destructive",
      });
      return;
    }

    if (isCardFormat) {
      console.log("[PDFGenerator] Generating card format PDF");
      const pdfDataUrl = PDFCardGenerator.generate(profile, trustedPersons);
      setPdfUrl(pdfDataUrl);
      setShowPreview(true);
      return;
    }

    handlePDFGeneration(
      profile,
      responses,
      trustedPersons,
      setPdfUrl,
      setShowPreview
    );
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
      >
        <FileText className="h-4 w-4" />
        {isCardFormat ? "Générer au format carte" : "Générer Mes directives anticipées"}
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onEmail={handleEmail}
        onSave={() => handlePDFDownload(pdfUrl)}
        onPrint={() => handlePDFPrint(pdfUrl)}
      />
    </>
  );
}
