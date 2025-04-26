
import { useState, useEffect } from "react";
import { PDFGenerationButtons } from "./PDFGenerationButtons";
import { PDFGeneratorStatus } from "./PDFGeneratorStatus";
import { usePDFGenerationState } from "./usePDFGenerationState";
import { PDFGenerationSafetyTimeout } from "./components/PDFGenerationSafetyTimeout";
import { usePDFGeneration } from "./hooks/usePDFGeneration";
import { PDFPreviewDialog } from "./PDFPreviewDialog";
import { UserProfile, TrustedPerson } from "./types";
import { Button } from "../ui/button";
import { FileText, Download, Save } from "lucide-react";
import { handlePDFDownload } from "./utils/PDFGenerationUtils";

interface PDFMainGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
  profile: UserProfile | null;
  responses: any;
  trustedPersons: TrustedPerson[];
  synthesis?: { free_text: string } | null;
  isCard?: boolean;
  onGenerationStart?: () => void;
  generationState?: 'idle' | 'generating' | 'completed';
}

export function PDFMainGenerator({
  userId,
  onPdfGenerated,
  synthesisText,
  profile,
  responses,
  trustedPersons,
  synthesis,
  isCard,
  onGenerationStart,
  generationState = 'idle'
}: PDFMainGeneratorProps) {
  const [errorCount, setErrorCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const { 
    currentWaitingMessage,
    setIsGenerating: setStateIsGenerating
  } = usePDFGenerationState();

  const {
    isGenerating,
    progress,
    pdfUrl,
    generatePDF,
    saveToDocuments
  } = usePDFGeneration(
    userId,
    profile,
    responses,
    trustedPersons,
    (url) => {
      if (onPdfGenerated) {
        onPdfGenerated(url);
      }
    },
    onGenerationStart,
    synthesisText,
    isCard
  );

  // Effect to sync with external generation state
  useEffect(() => {
    if (generationState === 'generating' && !isGenerating) {
      setStateIsGenerating(true);
    } else if (generationState === 'idle' && isGenerating) {
      setStateIsGenerating(false);
    }
  }, [generationState, isGenerating, setStateIsGenerating]);

  const handleDownload = () => {
    handlePDFDownload(pdfUrl);
  };

  return (
    <>
      <PDFGenerationSafetyTimeout
        isGenerating={isGenerating}
        pdfUrl={pdfUrl}
        setIsGenerating={setStateIsGenerating}
        setErrorCount={setErrorCount}
      />
      
      <PDFGeneratorStatus
        isGenerating={isGenerating}
        progress={progress}
        currentWaitingMessage={currentWaitingMessage}
        profile={profile}
        pdfUrl={pdfUrl}
        responses={responses}
        synthesis={synthesis}
        isCard={isCard}
      />
      
      {!pdfUrl && (
        <Button 
          onClick={generatePDF}
          className="w-full mb-4 py-6 flex items-center justify-center gap-2"
          disabled={isGenerating}
        >
          <FileText className="h-5 w-5 mr-2" />
          {isCard ? 'Générer ma carte d\'accès' : 'Générer mes directives anticipées'}
        </Button>
      )}

      {pdfUrl && (
        <div className="space-y-4">
          <Button 
            onClick={() => setShowPreview(true)}
            className="w-full"
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Prévisualiser {isCard ? "la carte" : "les directives"}
          </Button>
          
          <Button 
            onClick={handleDownload}
            className="w-full"
            variant="secondary"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger sur mon ordinateur
          </Button>
          
          <Button 
            onClick={saveToDocuments}
            className="w-full"
            variant="default"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder dans mes documents
          </Button>
        </div>
      )}

      {pdfUrl && showPreview && (
        <PDFPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          pdfUrl={pdfUrl}
        />
      )}
    </>
  );
}
