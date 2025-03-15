
import { useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";
import { usePDFGenerationState } from "@/hooks/usePDFGenerationState";
import { PDFGenerationOverlay } from "./pdf/PDFGenerationOverlay";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
}

export function PDFGenerator({ userId, onPdfGenerated }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  
  const { responses, synthesis, isLoading: responsesLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading: profileLoading } = usePDFData();
  const { 
    currentMessageIndex,
    waitingMessages,
    isGenerating,
    startGeneration,
    finishGeneration
  } = usePDFGenerationState();
  const {
    pdfUrl,
    setPdfUrl,
    showPreview,
    setShowPreview,
    generatePDF,
    handleDownload
  } = usePDFGeneration();

  // Try to load from localStorage if we have a saved PDF
  useEffect(() => {
    try {
      const savedPdf = localStorage.getItem(`pdf_${userId}`);
      if (savedPdf && !pdfUrl) {
        console.log("[PDFGenerator] Found saved PDF in localStorage");
        setPdfUrl(savedPdf);
      }
    } catch (e) {
      console.warn("[PDFGenerator] Could not read from localStorage:", e);
    }
  }, [userId, pdfUrl, setPdfUrl]);

  // Enhanced debug logging
  useEffect(() => {
    console.log("[PDFGenerator] Current state:", {
      hasProfile: !!profile,
      hasTrustedPersons: trustedPersons.length,
      hasResponses: !!responses,
      hasSynthesis: !!synthesis,
      synthesisType: synthesis ? typeof synthesis : 'none',
      synthesisTextLength: synthesis?.free_text?.length || 0,
      synthesisTextSample: synthesis?.free_text ? 
        synthesis.free_text.substring(0, 30) + (synthesis.free_text.length > 30 ? '...' : '') : 
        'None',
      isLoading: responsesLoading || profileLoading
    });
  }, [profile, trustedPersons, responses, synthesis, responsesLoading, profileLoading]);

  const handleGeneratePDF = async () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    startGeneration();
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      finishGeneration(null, false);
      return;
    }

    // Make sure to combine the synthesis with the responses
    const fullResponses = {
      ...responses,
      synthesis: synthesis || null
    };

    console.log("[PDFGenerator] Generating full PDF with synthesis:", synthesis ? "Present" : "Not present");
    if (synthesis) {
      console.log("[PDFGenerator] Synthesis details:", {
        type: typeof synthesis,
        hasText: !!synthesis.free_text,
        textLength: synthesis.free_text?.length || 0,
        textSample: synthesis.free_text ? 
          synthesis.free_text.substring(0, 30) + (synthesis.free_text.length > 30 ? '...' : '') : 
          'None'
      });
    }

    const pdfData = await generatePDF(profile, fullResponses, trustedPersons, {
      saveToStorage: true,
      onSuccess: (url) => {
        console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
        
        // Store the PDF URL in localStorage as a backup
        try {
          localStorage.setItem(`pdf_${userId}`, url);
          console.log("[PDFGenerator] PDF URL saved to localStorage");
        } catch (e) {
          console.warn("[PDFGenerator] Could not save PDF to localStorage:", e);
        }
        
        finishGeneration(url);
        
        if (onPdfGenerated) {
          onPdfGenerated(url);
        }
      },
      onError: () => {
        finishGeneration(null, false);
        if (onPdfGenerated) {
          onPdfGenerated(null);
        }
      }
    });
    
    if (!pdfData) {
      finishGeneration(null, false);
    }
  };

  if (responsesLoading || profileLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering buttons, pdfUrl exists:", !!pdfUrl);
  return (
    <>
      <PDFGenerationOverlay 
        isVisible={isGenerating}
        message={waitingMessages[currentMessageIndex]}
      />
      
      <Button 
        onClick={handleGeneratePDF}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        <FileText className="h-4 w-4" />
        Générer Mes directives anticipées
      </Button>
      
      <PDFPreviewDialog
        key={`pdf-preview-${Date.now()}`} // Force new instance on each render
        open={showPreview}
        onOpenChange={(open) => {
          console.log("[PDFGenerator] Dialog state changing to:", open);
          setShowPreview(open);
        }}
        pdfUrl={pdfUrl}
        onSave={() => {
          console.log("[PDFGenerator] Saving PDF");
          handleDownload();
        }}
      />
    </>
  );
}
