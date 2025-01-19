import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFData } from "../pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "../pdf/utils/PDFGenerationUtils";

export function TrustedPersonPDFGenerator() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[TrustedPersonPDF] Starting PDF generation");
    handlePDFGeneration(profile, { type: "trusted_person" }, trustedPersons, setPdfUrl, setShowPreview);
  };

  useEffect(() => {
    if (!loading && profile && trustedPersons.length > 0) {
      console.log("[TrustedPersonPDF] Auto-generating PDF");
      generatePDF();
    }
  }, [loading, profile, trustedPersons]);

  const handleEmail = async () => {
    console.log("[TrustedPersonPDF] Email functionality not yet implemented");
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
        Générer le document de désignation
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