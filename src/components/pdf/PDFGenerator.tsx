
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { PDFCardGenerator } from "./utils/PDFCardGenerator";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [showCardPreview, setShowCardPreview] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();
  const {
    pdfUrl,
    setPdfUrl,
    showPreview,
    setShowPreview,
    isGenerating,
    generatePDF,
    handleDownload
  } = usePDFGeneration();

  const handleGeneratePDF = async () => {
    console.log("[PDFGenerator] Starting PDF generation with profile:", profile);
    await generatePDF(profile, responses, trustedPersons, {
      saveToStorage: true
    });
  };

  const generateCardPDF = () => {
    console.log("[PDFGenerator] Starting card PDF generation");
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      return;
    }

    const pdfDataUrl = PDFCardGenerator.generate(profile, trustedPersons);
    setPdfUrl(pdfDataUrl);
    setShowPreview(true);
  };

  const handleEmail = async () => {
    console.log("[PDFGenerator] Email functionality not yet implemented");
  };

  if (loading) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleGeneratePDF}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <FileText className="h-4 w-4" />
        {isGenerating ? "Génération en cours..." : "Générer Mes directives anticipées"}
      </Button>

      <Button 
        onClick={generateCardPDF}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <CreditCard className="h-4 w-4" />
        Générer au format carte
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onEmail={handleEmail}
        onSave={handleDownload}
      />
    </div>
  );
}
