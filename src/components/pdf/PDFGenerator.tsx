
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { PDFCardGenerator } from "./utils/PDFCardGenerator";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[PDFGenerator] Starting PDF generation with profile:", profile);
    handlePDFGeneration(
      profile,
      responses,
      trustedPersons,
      (url: string | null) => {
        if (url) {
          const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
          console.log("[PDFGenerator] Cleaned URL:", cleanUrl);
          setPdfUrl(cleanUrl);
        } else {
          setPdfUrl(null);
        }
      },
      setShowPreview
    );
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
        onClick={generatePDF}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>

      <Button 
        onClick={generateCardPDF}
        variant="outline"
        className="flex items-center gap-2"
      >
        <CreditCard className="h-4 w-4" />
        Générer au format carte
      </Button>
      
      <PDFPreviewDialog
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onEmail={handleEmail}
        onSave={() => handlePDFDownload(pdfUrl)}
        onPrint={() => handlePDFPrint(pdfUrl)}
      />
    </div>
  );
}
