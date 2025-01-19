import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./usePDFData";
import { handlePDFGeneration, handlePDFDownload, handlePDFPrint } from "./utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./PDFPreviewDialog";

interface PDFGeneratorProps {
  userId: string;
}

export function PDFGenerator({ userId }: PDFGeneratorProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { responses } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  const generatePDF = () => {
    handlePDFGeneration(profile, responses, trustedPersons, setPdfUrl, setShowPreview);
  };

  const handleEmail = async () => {
    // Email handling logic here - to be implemented
    console.log("[PDFGenerator] Email functionality not yet implemented");
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <button onClick={generatePDF}>Générer le PDF</button>
      
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