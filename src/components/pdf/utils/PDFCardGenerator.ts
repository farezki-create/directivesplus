
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
      // Approche améliorée pour générer un PDF valide
      const pdfOutput = doc.output('arraybuffer');
      const pdfBlob = new Blob([pdfOutput], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      console.log("[PDFCardGenerator] PDF generated successfully as blob URL");
      return blobUrl;
    } catch (error) {
      console.error("[PDFCardGenerator] Error generating PDF as blob:", error);
      
      // Fallback to data URL method if blob fails
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
