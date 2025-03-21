
import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";
import { PDFGenerationButtons } from "./pdf/PDFGenerationButtons";
import { PDFGenerationOverlay } from "./pdf/PDFGenerationOverlay";
import { usePDFGenerationState } from "./pdf/usePDFGenerationState";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
}

/**
 * @protected
 * CCOMPOSANT PROTÉGÉ - NE PAS MODIFIER LA MÉTHODE DE GÉNÉRATION PDF
 * Protected component - do not modify the PDF generation method
 * Version: 1.0.0
 */
export function PDFGenerator({ userId, onPdfGenerated, synthesisText }: PDFGeneratorProps) {
  console.log("[PDFGenerator] Initializing with userId:", userId);
  console.log("[PDFGenerator] Synthesis text provided:", synthesisText ? "Yes" : "No");
  
  const { 
    pdfUrl, setPdfUrl, 
    showPreview, setShowPreview,
    documentIdentifier, setDocumentIdentifier,
    isGenerating, setIsGenerating,
    progress, setProgress,
    currentWaitingMessage 
  } = usePDFGenerationState();
  
  const { responses, synthesis, isLoading } = useQuestionnairesResponses(userId);
  const { profile, trustedPersons, loading } = usePDFData();

  console.log("[PDFGenerator] Current state:", {
    hasProfile: !!profile,
    hasTrustedPersons: trustedPersons.length,
    hasResponses: !!responses,
    isLoading: loading || isLoading,
    synthesisText: synthesisText ? "Provided" : "Not provided",
    dbSynthesis: synthesis?.free_text ? "Available" : "Not available"
  });

  const generatePDF = () => {
    console.log("[PDFGenerator] Button clicked - Starting PDF generation");
    setIsGenerating(true);
    setProgress(10); // Start with some progress
    
    if (!profile) {
      console.error("[PDFGenerator] No profile data available");
      toast({
        title: "Erreur",
        description: "Données de profil non disponibles. Veuillez compléter votre profil.",
        variant: "destructive",
      });
      setIsGenerating(false);
      return;
    }

    try {
      console.log("[PDFGenerator] Generating full PDF");
      
      // Use provided synthesis text if available, otherwise fallback to database
      const finalSynthesisText = synthesisText || synthesis?.free_text || "";
      console.log("[PDFGenerator] Using synthesis text, length:", finalSynthesisText.length);
      
      // Small delay to ensure UI updates before heavy PDF generation starts
      setTimeout(() => {
        handlePDFGeneration(
          profile,
          {
            ...responses,
            synthesis: { free_text: finalSynthesisText }
          },
          trustedPersons,
          async (url) => {
            console.log("[PDFGenerator] PDF generated, URL status:", url ? "success" : "failed");
            
            // Set progress to complete
            setProgress(100);
            
            // Generate document identifier based on profile info
            if (url && profile) {
              try {
                const firstName = profile.first_name || 'unknown';
                const lastName = profile.last_name || 'unknown';
                const birthDate = profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : 'unknown';
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
                
                const identifier = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
                const sanitizedIdentifier = identifier.replace(/[^a-zA-Z0-9_-]/g, '_');
                
                // Save identifier for display
                setDocumentIdentifier(sanitizedIdentifier);
                
                // Store the PDF URL in localStorage as a backup
                localStorage.setItem(`pdf_${userId}`, url);
                localStorage.setItem(`pdf_identifier_${userId}`, sanitizedIdentifier);
                console.log("[PDFGenerator] PDF URL and identifier saved to localStorage");
              } catch (e) {
                console.warn("[PDFGenerator] Could not save PDF to localStorage:", e);
              }
            }
            
            // Short delay to show 100% before hiding the loading screen
            setTimeout(() => {
              setPdfUrl(url);
              if (onPdfGenerated) {
                onPdfGenerated(url);
              }
              setIsGenerating(false);
            }, 500);
          },
          setShowPreview
        );
      }, 500);
    } catch (error) {
      console.error("[PDFGenerator] Error during PDF generation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  if (loading || isLoading) {
    console.log("[PDFGenerator] Still loading data...");
    return null;
  }

  console.log("[PDFGenerator] Rendering buttons");
  return (
    <>
      <PDFGenerationOverlay 
        isGenerating={isGenerating} 
        progress={progress} 
        waitingMessage={currentWaitingMessage} 
      />
      
      <PDFGenerationButtons 
        pdfUrl={pdfUrl} 
        isGenerating={isGenerating} 
        onGenerateClick={generatePDF}
        documentIdentifier={documentIdentifier}
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
          externalDocumentId={documentIdentifier}
        />
      )}
    </>
  );
}
