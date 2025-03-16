
import { useState } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";
import { PDFGenerationProgress } from "./pdf/PDFGenerationProgress";
import { PDFGenerationButton } from "./pdf/PDFGenerationButton";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
}

/**
 * @protected
 * CCOMPOSANT PROTÉGÉ - NE PAS MODIFIER LA MÉTHODE DE GÉNÉRATION PDF
 * Protected component - do not modify the PDF generation method
 * Version: 1.0.0
 */
export function PDFGenerator({ userId, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { responses, loading } = useQuestionnairesResponses(userId);

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  const handleGenerationComplete = (url: string | null) => {
    setPdfUrl(url);
    setIsGenerating(false);
    if (onPdfGenerated) {
      onPdfGenerated(url);
    }
  };
  
  if (loading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering component");
  return (
    <>
      <PDFGenerationProgress isGenerating={isGenerating} />
      
      <PDFGenerationButton
        userId={userId}
        responses={responses}
        onGenerationStart={handleGenerationStart}
        onGenerationComplete={handleGenerationComplete}
        onShowPreview={setShowPreview}
      />
      
      {showPreview && (
        <PDFPreviewDialog
          key={pdfUrl}
          open={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          onSave={() => handlePDFDownload(pdfUrl)}
        />
      )}
    </>
  );
}
