import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./pdf/utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SignatureCanvas } from "./pdf/SignatureCanvas";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    console.log("[PDFGenerator] Starting PDF generation with profile:", profile);
    handlePDFGeneration(profile, responses, trustedPersons, signatureData, (url: string | null) => {
      if (url) {
        const cleanUrl = url.replace(/([^:])\/\/+/g, '$1/').replace(/:\//g, '://');
        console.log("[PDFGenerator] Cleaned URL:", cleanUrl);
        setPdfUrl(cleanUrl);
      } else {
        setPdfUrl(null);
      }
    }, setShowPreview);
  };

  const handleEmail = async () => {
    console.log("[PDFGenerator] Email functionality not yet implemented");
  };

  const handleSignature = (signature: string) => {
    setSignatureData(signature);
    setShowSignature(false);
    generatePDF();
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Button 
        onClick={() => setShowSignature(true)}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Signer et générer mes directives anticipées
      </Button>
      
      <Dialog open={showSignature} onOpenChange={setShowSignature}>
        <DialogContent>
          <SignatureCanvas onSave={handleSignature} />
        </DialogContent>
      </Dialog>

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