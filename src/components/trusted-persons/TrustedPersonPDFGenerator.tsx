
import { useState } from "react";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFData } from "../pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload } from "../pdf/utils/PDFGenerationUtils";

export function TrustedPersonPDFGenerator() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, trustedPersons, loading } = usePDFData();

  // Auto-generate PDF when component mounts
  useState(() => {
    generatePDF();
  }, []);

  const generatePDF = () => {
    console.log("[TrustedPersonPDF] Starting PDF generation");
    handlePDFGeneration(
      profile,
      { type: "trusted_person" },
      trustedPersons,
      (url: string | null) => {
        if (url) {
          const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
          console.log("[TrustedPersonPDF] Cleaned URL:", cleanUrl);
          setPdfUrl(cleanUrl);
          setShowPreview(true);
        } else {
          setPdfUrl(null);
        }
      },
      setShowPreview
    );
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onSave={() => handlePDFDownload(pdfUrl)}
      />
    </>
  );
}
