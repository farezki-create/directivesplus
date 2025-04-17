
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "@/components/pdf/types";
import { PDFStorageService } from './storage/PDFStorageService';
import { supabase } from "@/integrations/supabase/client";
import { CloudStorageProvider } from "./storage/types";
import { PageManager } from "@/components/pdf/utils/PageManager";
import { PDFUserSection } from "@/components/pdf/utils/PDFUserSection";
import { PDFTrustedPersonSection } from "@/components/pdf/utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "@/components/pdf/utils/PDFResponsesSection";
import { PDFSynthesisSection } from "@/components/pdf/utils/PDFSynthesisSection";
import { DocumentFooter } from "@/components/pdf/utils/DocumentFooter";
import { SignatureHandler } from "@/components/pdf/utils/SignatureHandler";

export class PDFGenerationService {
  static setStorageProvider(provider: CloudStorageProvider): void {
    PDFStorageService.setStorageProvider(provider);
  }

  static getStorageProvider(): CloudStorageProvider {
    return PDFStorageService.getStorageProvider();
  }

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

      // Get user email from auth session if not provided in the profile
      if (!profile.email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          profile.email = session.user.email;
        }
      }

      // Ensure unique_identifier is set
      if (!profile.unique_identifier) {
        profile.unique_identifier = userId;
      }

      // Use the passed text parameter if provided, otherwise use the synthesis text from database
      const finalSynthesisText = synthesisText || responses.synthesis?.free_text || "";

      // Generate PDF with all responses
      const pdfDoc = new jsPDF();
      const title = "Directives Anticipées";
      const subtitle = "Vos préférences en matière de soins médicaux";
      let yPosition = 30;

      // Add document metadata
      pdfDoc.setProperties({
        title: title,
        subject: subtitle,
        author: "Directives Anticipées",
        creator: "Directives Anticipées",
      });

      // Add header
      yPosition = PageManager.addHeader(pdfDoc, title, subtitle, yPosition);

      // User Information Section
      yPosition = PDFUserSection.generate(pdfDoc, profile, yPosition);
      yPosition += 10;

      // Trusted Person Section
      if (trustedPersons && trustedPersons.length > 0) {
        yPosition = PDFTrustedPersonSection.generate(pdfDoc, trustedPersons, yPosition);
        yPosition += 10;
      }

      // Responses Section
      yPosition = PDFResponsesSection.generate(pdfDoc, responses, yPosition);
      yPosition += 10;

      // Synthesis Section
      yPosition = PDFSynthesisSection.generate(pdfDoc, responses, yPosition);
      yPosition += 10;

      // Add signature section
      yPosition = DocumentFooter.addSignatureSection(pdfDoc, profile, yPosition);

      // Apply signature
      await SignatureHandler.applySignature(pdfDoc, profile);

      // Add page numbers
      PageManager.addPageNumbers(pdfDoc);
      
      // Convert to data URL
      const pdfDataUrl = pdfDoc.output('dataurlstring');
      
      console.log("[PDFGenerationService] PDF generated successfully");
      return pdfDataUrl;
    } catch (error) {
      console.error("[PDFGenerationService] Error generating PDF:", error);
      throw error;
    }
  }

  static uploadToCloud = PDFStorageService.uploadToCloud;
  static retrieveFromCloud = PDFStorageService.retrieveFromCloud;
  static handlePrint = PDFStorageService.handlePrint;
}

// Properly re-export both types and values
export type { CloudStorageProvider } from './storage/types';
// Export the implementation too, not just the type
export { SupabaseStorageProvider } from './storage/providers/SupabaseProvider';
