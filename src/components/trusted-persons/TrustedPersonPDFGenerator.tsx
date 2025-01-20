import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFPreviewDialog } from "../pdf/PDFPreviewDialog";
import { usePDFData } from "../pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "../pdf/utils/PDFGenerationUtils";
import { SignatureDialog } from "../pdf/SignatureDialog";

export function TrustedPersonPDFGenerator() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[TrustedPersonPDF] Starting PDF generation");
    handlePDFGeneration(
      profile,
      { type: "trusted_person" },
      trustedPersons,
      null,
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

  const handleSignature = (signatureData: string) => {
    console.log("[TrustedPersonPDF] Adding signature to PDF");
    handlePDFGeneration(
      profile,
      { type: "trusted_person" },
      trustedPersons,
      signatureData,
      (url: string | null) => {
        if (url) {
          const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
          console.log("[TrustedPersonPDF] Cleaned URL with signature:", cleanUrl);
          setPdfUrl(cleanUrl);
        }
      },
      setShowPreview
    );
  };

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
        onSign={() => setShowSignature(true)}
      />

      <SignatureDialog
        open={showSignature}
        onOpenChange={setShowSignature}
        onSign={handleSignature}
      />
    </>
  );
}