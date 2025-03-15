
import { useEffect } from "react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { PDFGenerationButton } from "./pdf/buttons/PDFGenerationButton";
import { TextGenerationButton } from "./pdf/buttons/TextGenerationButton";
import { LoadingOverlay } from "./pdf/LoadingOverlay";
import { usePDFGeneration } from "./pdf/hooks/usePDFGeneration";
import { handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
}

const waitingMessages = [
  "Préparation de votre document avec soin... 📝",
  "Mise en page de vos directives... 📄",
  "Ajout d'une touche de professionnalisme... ✨",
  "Finalisation des derniers détails... 🎯",
  "Vérification de la mise en forme... 🔍",
  "Assemblage de vos informations... 📋",
  "Plus que quelques secondes... ⏳",
  "Votre document est presque prêt... 🌟",
];

export function PDFGenerator({ userId, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const {
    pdfUrl,
    textContent,
    showPreview,
    setShowPreview,
    isGenerating,
    generationFailed,
    generatePDF,
    generateTextDocument,
    loading
  } = usePDFGeneration(userId);

  // Call onPdfGenerated callback when pdfUrl changes
  useEffect(() => {
    if (onPdfGenerated) {
      onPdfGenerated(pdfUrl);
    }
  }, [pdfUrl, onPdfGenerated]);

  if (loading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering buttons");
  return (
    <>
      <LoadingOverlay 
        isGenerating={isGenerating} 
        messages={waitingMessages} 
      />
      
      <div className="flex flex-wrap gap-4">
        <PDFGenerationButton 
          onClick={generatePDF}
          isGenerating={isGenerating}
          generationFailed={generationFailed}
        />
        
        <TextGenerationButton 
          onClick={generateTextDocument}
          isGenerating={isGenerating}
        />
      </div>
      
      {showPreview && (
        <PDFPreviewDialog
          key={`document-preview-${Date.now()}`}
          open={showPreview}
          onOpenChange={(open) => {
            console.log("[PDFGenerator] Dialog state changing to:", open);
            setShowPreview(open);
          }}
          pdfUrl={pdfUrl}
          textContent={textContent}
          onSave={() => handlePDFDownload(pdfUrl)}
        />
      )}
    </>
  );
}
