
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFData } from "../pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, savePDFToStorage } from "../pdf/utils/PDFGenerationUtils";

export function TrustedPersonPDFGenerator() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { profile, trustedPersons, loading } = usePDFData();

  useEffect(() => {
    if (!loading && profile) {
      generatePDF();
    }
  }, [loading, profile]);

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
        } else {
          setPdfUrl(null);
        }
      },
      setShowPreview
    );
  };

  const handleSave = () => {
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
    } else {
      generatePDF();
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={handleSave}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Enregistrer
      </Button>
      
      <PDFPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        pdfUrl={pdfUrl}
        onSave={() => handlePDFDownload(pdfUrl)}
      />
    </>
  );
}
