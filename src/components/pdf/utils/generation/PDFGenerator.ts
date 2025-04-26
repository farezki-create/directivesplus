
import { PDFDocumentGenerator } from "../../PDFDocumentGenerator";
import { toast } from "@/hooks/use-toast";
import { uploadPDFToStorage } from "../upload/PDFUploader";
import { syncSynthesisToCloud } from "../sync/PDFSynthesisSync";

/**
 * Handles the complete PDF generation process
 */
export async function handlePDFGeneration(
  profile: any,
  responses: any,
  trustedPersons: any[],
  onComplete: (url: string | null) => void,
  onShowPreview?: (show: boolean) => void,
  synthesisText?: string,
  isCard?: boolean
) {
  if (!profile) {
    console.error("[PDFGenerator] No profile data available");
    toast({
      title: "Erreur",
      description: "Données de profil non disponibles.",
      variant: "destructive",
    });
    onComplete(null);
    return;
  }
  
  try {
    console.log("[PDFGenerator] Starting PDF generation process with isCard:", isCard);
    
    // Generate the PDF document
    const pdfDataUrl = await PDFDocumentGenerator.generate(
      profile,
      responses,
      trustedPersons,
      isCard
    );
    
    if (!pdfDataUrl) {
      throw new Error("Failed to generate PDF");
    }
    
    console.log("[PDFGenerator] PDF generated successfully");
    
    // Sync synthesis data to cloud if possible
    if (profile.unique_identifier) {
      try {
        await syncSynthesisToCloud(profile.unique_identifier);
      } catch (syncError) {
        console.error("[PDFGenerator] Failed to sync synthesis:", syncError);
        // Continue despite sync error
      }
    }
    
    // Show preview if needed
    if (onShowPreview) {
      onShowPreview(true);
    }
    
    // Complete the process
    onComplete(pdfDataUrl);
    
    return pdfDataUrl;
  } catch (error) {
    console.error("[PDFGenerator] Error generating PDF:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la génération du document.",
      variant: "destructive",
    });
    onComplete(null);
    return null;
  }
}
