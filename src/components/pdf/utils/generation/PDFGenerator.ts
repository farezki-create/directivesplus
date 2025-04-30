
import { toast } from "@/hooks/use-toast";
import { UserProfile, TrustedPerson } from "../../types";
import { PDFDocumentGenerator } from "../../PDFDocumentGenerator";
import { PDFStorageService } from "./PDFStorageService";

/**
 * Handles the PDF generation process
 * @param profile - The user profile data
 * @param responses - The questionnaire responses
 * @param trustedPersons - Trusted persons information
 * @param setPdfUrl - Callback to set the PDF URL
 * @param setShowPreview - Callback to toggle preview visibility
 * @param isCard - Whether to generate a card format PDF
 * @returns The generated PDF data URL or null
 */
export const generatePDF = async (
  profile: UserProfile | null,
  responses: any,
  trustedPersons: TrustedPerson[],
  setPdfUrl: (url: string | null) => void,
  setShowPreview: (show: boolean) => void,
  isCard: boolean = false
) => {
  try {
    console.log("[PDFGeneration] Starting PDF generation", isCard ? "as card" : "as full document");
    if (!profile) {
      console.error("[PDFGeneration] No profile data available");
      throw new Error("Les données du profil sont requises");
    }

    console.log("[PDFGeneration] Profile data:", JSON.stringify(profile, null, 2));
    console.log("[PDFGeneration] Responses data:", Object.keys(responses || {}));
    console.log("[PDFGeneration] Is card format:", isCard);
    
    if (responses?.synthesis) {
      const textLength = responses.synthesis.free_text ? responses.synthesis.free_text.length : 0;
      console.log("[PDFGeneration] Synthesis text length:", textLength);
      if (textLength > 0) {
        console.log("[PDFGeneration] Synthesis text preview:", 
          responses.synthesis.free_text?.substring(0, 100) + "...");
      }
    }

    // Generate PDF - Pass the isCard parameter
    const pdfDataUrl = await PDFDocumentGenerator.generate(profile, responses, trustedPersons, isCard);
    
    if (!pdfDataUrl) {
      console.error("[PDFGeneration] PDF generation failed - no data URL returned");
      throw new Error("La génération du PDF a échoué");
    }

    console.log("[PDFGeneration] PDF generated with data URL length:", pdfDataUrl.length);

    // Save PDF to storage if user is logged in
    if (profile.unique_identifier) {
      try {
        console.log("[PDFGeneration] Saving PDF to storage for user:", profile.unique_identifier);
        await PDFStorageService.savePDFToStorage(pdfDataUrl, profile.unique_identifier, isCard);
      } catch (storageError) {
        console.error("[PDFGeneration] Error saving PDF to storage:", storageError);
        // Continue with preview even if storage fails
      }
    }

    // Return the generated PDF URL to the callback
    setPdfUrl(pdfDataUrl);
    setShowPreview(true);

    console.log("[PDFGeneration] PDF generated successfully");
    toast({
      title: "Succès",
      description: isCard ? "Votre carte d'accès a été générée avec succès." : "Le PDF a été généré avec succès.",
    });
    
    return pdfDataUrl;
  } catch (error) {
    console.error("[PDFGeneration] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez vérifier que toutes vos informations sont remplies.",
      variant: "destructive",
    });
    return null;
  }
};
