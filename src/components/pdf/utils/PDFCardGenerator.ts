
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { cardDimensions, pageLayout } from "./constants/cardDimensions";
import { CardContentGenerator } from "./generators/CardContentGenerator";
import { InstructionsGenerator } from "./generators/InstructionsGenerator";

export class PDFCardGenerator {
  static async generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Generating foldable double-card PDF");
    
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Generate the first card (Directives Anticipées)
    CardContentGenerator.generateCardContent(
      doc,
      "CARTE DIRECTIVES ANTICIPÉES",
      pageLayout.margin,
      pageLayout.cardsStartY,
      profile,
      true,
      trustedPersons
    );
    
    // Generate the second card (Documents Médicaux)
    CardContentGenerator.generateCardContent(
      doc,
      "CARTE DOCUMENTS MÉDICAUX",
      pageLayout.margin * 2 + cardDimensions.width,
      pageLayout.cardsStartY,
      profile,
      false,
      trustedPersons
    );

    // Add folding instructions
    InstructionsGenerator.addFoldingInstructions(doc);

    // Add usage instructions
    InstructionsGenerator.addUsageInstructions(
      doc,
      pageLayout.margin,
      pageLayout.cardsStartY + cardDimensions.height
    );

    try {
      // Generate PDF as blob with proper MIME type
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(
        new Blob([pdfBlob], { type: 'application/pdf' })
      );
      
      console.log("[PDFCardGenerator] PDF generated successfully as blob URL");
      return blobUrl;
    } catch (error) {
      console.error("[PDFCardGenerator] Error generating PDF:", error);
      
      // Fallback method as last resort
      try {
        const dataUrl = doc.output('dataurlstring');
        console.log("[PDFCardGenerator] Fallback to data URL generation");
        return dataUrl;
      } catch (fallbackError) {
        console.error("[PDFCardGenerator] Complete PDF generation failure:", fallbackError);
        throw new Error("Impossible de générer le PDF");
      }
    }
  }
}
