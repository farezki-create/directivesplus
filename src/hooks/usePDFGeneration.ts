
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { generateSimplifiedPDF, generateBasicPDF, openPrintWindow } from "@/components/pdf/utils/PDFFallbackGenerator";
import { savePDFToStorage, handlePDFDownload } from "@/components/pdf/utils/PDFStorageUtils";

export function usePDFGeneration() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (
    profile: UserProfile | null,
    responses: any,
    trustedPersons: TrustedPerson[],
    options?: {
      onSuccess?: (url: string) => void;
      onError?: (error: Error) => void;
      saveToStorage?: boolean;
    }
  ) => {
    if (isGenerating) {
      console.log("[PDFGeneration] Generation already in progress, ignoring request");
      return;
    }

    try {
      setIsGenerating(true);
      console.log("[PDFGeneration] Starting PDF generation");
      
      if (!profile) {
        console.error("[PDFGeneration] No profile data available");
        throw new Error("Les données du profil sont requises");
      }

      console.log("[PDFGeneration] Profile data:", profile);
      console.log("[PDFGeneration] Responses data:", responses);

      // Generate PDF with fallback mechanisms
      let pdfDataUrl = null;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!pdfDataUrl && attempts < maxAttempts) {
        attempts++;
        console.log(`[PDFGeneration] Attempt ${attempts} of ${maxAttempts}`);
        
        try {
          if (attempts === 1) {
            // Try with the standard generator first
            pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons);
          } else if (attempts === 2) {
            // Try with simpler content if first attempt failed
            pdfDataUrl = await generateSimplifiedPDF(profile, responses, trustedPersons);
          } else {
            // Last attempt - generate extremely basic PDF
            pdfDataUrl = await generateBasicPDF(profile);
          }
        } catch (genError) {
          console.error(`[PDFGeneration] Error in attempt ${attempts}:`, genError);
          // Continue to next attempt
        }
        
        if (pdfDataUrl) {
          console.log(`[PDFGeneration] Successfully generated PDF on attempt ${attempts}`);
          break;
        }
        
        // Small delay before next attempt
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!pdfDataUrl) {
        console.error("[PDFGeneration] All PDF generation attempts failed");
        throw new Error("La génération du PDF a échoué après plusieurs tentatives");
      }

      // Save PDF to storage if requested and user is logged in
      if (options?.saveToStorage && profile.unique_identifier) {
        try {
          console.log("[PDFGeneration] Saving PDF to storage for user:", profile.unique_identifier);
          await savePDFToStorage(pdfDataUrl, profile.unique_identifier);
        } catch (storageError) {
          console.error("[PDFGeneration] Error saving PDF to storage:", storageError);
          // Continue with preview even if storage fails
        }
      }

      setPdfUrl(pdfDataUrl);
      setShowPreview(true);
      
      if (options?.onSuccess) {
        options.onSuccess(pdfDataUrl);
      }

      console.log("[PDFGeneration] PDF generated successfully");
      toast({
        title: "Succès",
        description: "Le PDF a été généré avec succès.",
      });
      
      return pdfDataUrl;
    } catch (error) {
      console.error("[PDFGeneration] Error generating PDF:", error);
      
      // Try in-browser printing as fallback if PDF generation fails completely
      try {
        console.log("[PDFGeneration] Attempting in-browser printing fallback");
        const printWindow = openPrintWindow(profile, responses);
        
        if (printWindow) {
          setPdfUrl(null);
          toast({
            title: "Alternative",
            description: "Une fenêtre d'impression a été ouverte pour les directives.",
          });
          return null;
        }
      } catch (printError) {
        console.error("[PDFGeneration] Print fallback also failed:", printError);
      }
      
      if (options?.onError) {
        options.onError(error instanceof Error ? error : new Error(String(error)));
      }
      
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      handlePDFDownload(pdfUrl);
    } else {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à télécharger.",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast({
        title: "Erreur",
        description: "Aucun PDF disponible à afficher.",
        variant: "destructive",
      });
    }
  };

  const resetState = () => {
    setPdfUrl(null);
    setShowPreview(false);
  };

  return {
    pdfUrl,
    setPdfUrl,
    showPreview,
    setShowPreview,
    isGenerating,
    generatePDF,
    handleDownload,
    openInNewTab,
    resetState
  };
}
