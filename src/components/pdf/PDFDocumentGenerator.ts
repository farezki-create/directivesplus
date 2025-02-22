
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with responses:", responses);
    const doc = new jsPDF();
    let yPosition = 20;

    // Add logo
    // Note: you'll need to add your logo image here
    // doc.addImage("logo.png", "PNG", 20, 10, 50, 20);
    
    // Title
    doc.setFontSize(20);
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Section 1: User Identity
    doc.setFontSize(16);
    doc.text("1. Mon identité", 20, yPosition);
    yPosition += 10;
    yPosition = PDFUserSection.generate(doc, profile, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // For trusted person document, skip directives anticipées section
    if (responses?.type !== "trusted_person") {
      // Section 2: Directives Anticipées Synthesis
      yPosition += 20;
      doc.setFontSize(16);
      doc.text("2. Synthèse de mes directives anticipées", 20, yPosition);
      yPosition += 10;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);

      // Add new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // Section for Trusted Person
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      responses?.type === "trusted_person" ? "2. Personne de confiance" : "3. Personne de confiance",
      20,
      yPosition
    );
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Final Section: Signature
    yPosition += 20;
    doc.setFontSize(12);
    
    // Je soussigné(e) section
    doc.text("Je soussigné(e)", 20, yPosition);
    yPosition += 10;
    
    // Name line
    doc.text("Nom et prénoms : ................................................", 20, yPosition);
    yPosition += 15;
    
    // Date and place line spanning the width
    doc.text("Fait le ........................... à .................................", 20, yPosition);
    yPosition += 20;
    
    // Signature
    doc.setFontSize(12);
    doc.text("Signature :", 20, yPosition);

    return doc.output('dataurlstring');
  }
}
