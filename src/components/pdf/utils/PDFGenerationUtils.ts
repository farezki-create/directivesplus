
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../types";
import { PDFDocumentGenerator } from "../PDFDocumentGenerator";
import { generateSimplifiedPDF, generateBasicPDF, openPrintWindow } from "./PDFFallbackGenerator";
import { savePDFToStorage, handlePDFDownload } from "./PDFStorageUtils";

/**
 * Main function that handles PDF generation with retries and fallbacks
 */
export const handlePDFGeneration = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void
) => {
  try {
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

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
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

    console.log("[PDFGeneration] PDF generated successfully");
    toast({
      title: "Succès",
      description: "Le PDF a été généré avec succès.",
    });
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
        return;
      }
    } catch (printError) {
      console.error("[PDFGeneration] Print fallback also failed:", printError);
    }
    
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
  }
};

// Re-export functions from other modules for backward compatibility
export { savePDFToStorage, handlePDFDownload };
