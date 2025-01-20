import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { SignatureDialog } from "./SignatureDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[PDFGenerator] Starting PDF generation with profile:", profile);
    handlePDFGeneration(
      profile,
      responses,
      trustedPersons,
      null,
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

  const handleSignature = (signatureData: string) => {
    console.log("[PDFGenerator] Adding signature to PDF");
    handlePDFGeneration(
      profile,
      responses,
      trustedPersons,
      signatureData,
      (url: string | null) => {
        if (url) {
          const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
          console.log("[PDFGenerator] Cleaned URL with signature:", cleanUrl);
          setPdfUrl(cleanUrl);
        }
      },
      setShowPreview
    );
  };

  const handleEmail = async () => {
    console.log("[PDFGenerator] Email functionality not yet implemented");
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
        Générer Mes directives anticipées
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