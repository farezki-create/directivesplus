import { useState, useEffect } from "react";
import { useQuestionnairesResponses } from "@/hooks/useQuestionnairesResponses";
import { usePDFData } from "./pdf/usePDFData";
import { handlePDFGeneration, handlePDFDownload } from "./pdf/utils/PDFGenerationUtils";
import { PDFPreviewDialog } from "./pdf/PDFPreviewDialog";
import { toast } from "@/hooks/use-toast";
import { PDFGenerationButtons } from "./pdf/PDFGenerationButtons";
import { PDFGenerationOverlay } from "./pdf/PDFGenerationOverlay";
import { usePDFGenerationState } from "./pdf/usePDFGenerationState";
import { PDFGenerationService } from "@/utils/PDFGenerationService";
import { supabase } from "@/integrations/supabase/client";

interface PDFGeneratorProps {
  userId: string;
  onPdfGenerated?: (url: string | null) => void;
  synthesisText?: string;
}

/**
 * @protected
 * COMPOSANT PROTÉGÉ - NE PAS MODIFIER LA MÉTHODE DE GÉNÉRATION PDF
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
    setProgress(10);
    
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
      
      const finalSynthesisText = synthesisText || synthesis?.free_text || "";
      
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
            setProgress(100);
            
            if (url && profile) {
              try {
                const firstName = profile.first_name || 'unknown';
                const lastName = profile.last_name || 'unknown';
                const birthDate = profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : 'unknown';
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
                
                const identifier = `${lastName}_${firstName}_${birthDate}_${timestamp}`;
                const sanitizedIdentifier = identifier.replace(/[^a-zA-Z0-9_-]/g, '_');
                
                setDocumentIdentifier(sanitizedIdentifier);
                
                // Sauvegarder automatiquement dans pdf_documents
                const response = await fetch(url);
                const blob = await response.blob();
                const fileName = `directives-anticipees_${sanitizedIdentifier}.pdf`;
                const filePath = `${userId}/${fileName}`;

                // Upload to Supabase storage
                const { data: storageData, error: storageError } = await supabase
                  .storage
                  .from('directives_pdfs')
                  .upload(filePath, blob, {
                    contentType: 'application/pdf',
                    upsert: false
                  });

                if (storageError) {
                  console.error("[PDFGenerator] Storage upload error:", storageError);
                  throw storageError;
                }

                // Save reference in database
                const { error: dbError } = await supabase
                  .from('pdf_documents')
                  .insert({
                    user_id: userId,
                    file_name: fileName,
                    file_path: filePath,
                    content_type: 'application/pdf',
                    description: `Directives anticipées de ${firstName} ${lastName}`,
                    created_at: new Date().toISOString()
                  });

                if (dbError) {
                  console.error("[PDFGenerator] Database insert error:", dbError);
                  throw dbError;
                }

                toast({
                  title: "Document sauvegardé",
                  description: "Le document a été automatiquement ajouté à vos documents",
                });
                
                localStorage.setItem(`pdf_${userId}`, url);
                localStorage.setItem(`pdf_identifier_${userId}`, sanitizedIdentifier);
              } catch (e) {
                console.error("[PDFGenerator] Error saving PDF:", e);
                toast({
                  title: "Erreur",
                  description: "Impossible de sauvegarder le document automatiquement",
                  variant: "destructive",
                });
              }
            }
            
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
