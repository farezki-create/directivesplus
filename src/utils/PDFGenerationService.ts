
import { supabase } from "@/integrations/supabase/client";
import { PDFDocumentGenerator } from "@/components/pdf/PDFDocumentGenerator";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { toast } from "@/hooks/use-toast";

/**
 * Service responsible for core PDF generation functionality
 */
export class PDFGenerationService {
  /**
   * Generate a PDF document with the provided data
   * @param userId - The user ID
   * @param profile - The user profile information
   * @param responses - The questionnaire responses
   * @param trustedPersons - The trusted persons
   * @param synthesisText - Optional override for synthesis text
   * @returns The generated PDF as a data URL
   */
  static async generatePDF(
    userId: string,
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[],
    synthesisText?: string
  ): Promise<string | null> {
    try {
      console.log("[PDFGenerationService] Generating PDF");
      
      if (!userId) {
        console.error("[PDFGenerationService] No user ID provided");
        throw new Error("User ID is required");
      }

      // Get user email from auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("No authenticated user");
      }

      // Use the passed text parameter if provided, otherwise use the synthesis text from database
      const finalSynthesisText = synthesisText || responses.synthesis?.free_text || "";

      // Generate PDF with all responses
      const pdfDataUrl = await PDFDocumentGenerator.generate(
        {
          ...profile,
          unique_identifier: userId,
          email: session.user.email
        },
        {
          ...responses,
          synthesis: { free_text: finalSynthesisText }
        },
        trustedPersons || []
      );
      
      console.log("[PDFGenerationService] PDF generated successfully");
      return pdfDataUrl;
    } catch (error) {
      console.error("[PDFGenerationService] Error generating PDF:", error);
      throw error;
    }
  }

  /**
   * Print the PDF document in a new window
   * @param pdfUrl - The PDF data URL
   */
  static handlePrint(pdfUrl: string | null): void {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    } else {
      toast({
        title: "Erreur",
        description: "Aucun document PDF à imprimer.",
        variant: "destructive",
      });
    }
  }
}
