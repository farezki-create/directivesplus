
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { cardDimensions } from "./utils/constants/cardDimensions";
import { AccessCardGenerator } from "./utils/card/AccessCardGenerator";
import { FullDocumentGenerator } from "./utils/document/FullDocumentGenerator";

export class PDFDocumentGenerator {
  static async generate(
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[],
    isCard: boolean = false
  ): Promise<string | null> {
    try {
      console.log("[PDFDocumentGenerator] Generating PDF document", isCard ? "as card format" : "as full document");
      console.log("[PDFDocumentGenerator] Profile:", profile);
      
      // Create a new PDF document with appropriate format
      const doc = isCard 
        ? new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [cardDimensions.width, cardDimensions.height]
          })
        : new jsPDF();
      
      if (isCard) {
        AccessCardGenerator.generate(doc, profile);
      } else {
        await FullDocumentGenerator.generate(doc, profile, responses, trustedPersons);
      }
      
      // Return the PDF as a data URL
      const output = doc.output('dataurlstring');
      console.log("[PDFDocumentGenerator] PDF generated successfully, data URL length:", output.length);
      return output;
    } catch (error) {
      console.error("[PDFDocumentGenerator] Error generating PDF:", error);
      return null;
    }
  }
}
