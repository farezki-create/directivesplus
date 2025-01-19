import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { PDFAccessSection } from "./utils/PDFAccessSection";
import { PDFDateSection } from "./utils/PDFDateSection";
import { PDFSignatureSection } from "./utils/PDFSignatureSection";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with responses:", responses);
    const doc = new jsPDF();
    let yPosition = 20;

    // Check if this is a trusted person document
    const isTrustedPersonDoc = responses?.type === "trusted_person";

    // Title
    doc.setFontSize(20);
    doc.text(
      isTrustedPersonDoc ? "Désignation de la personne de confiance" : "Directives Anticipées",
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

    // Section 2: Access Code and URL
    yPosition = PDFAccessSection.generate(doc, profile, yPosition);

    // For trusted person document, skip directives anticipées section
    if (!isTrustedPersonDoc) {
      // Section 3: Directives Anticipées Synthesis
      yPosition += 20;
      doc.setFontSize(16);
      doc.text("3. Synthèse de mes directives anticipées", 20, yPosition);
      yPosition += 10;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    }

    // Section for Trusted Person
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      isTrustedPersonDoc ? "3. Personne de confiance" : "4. Personne de confiance",
      20,
      yPosition
    );
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Ensure final section starts on a new page if there isn't enough space
    if (yPosition > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage();
      yPosition = 20;
    }

    // Final Section: Date, Place and Signature
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      isTrustedPersonDoc ? "4. Date, lieu et signature" : "5. Date, lieu et signature",
      20,
      yPosition
    );
    yPosition += 10;
    
    yPosition = PDFDateSection.generate(doc, yPosition);
    yPosition = PDFSignatureSection.generate(doc, yPosition);

    return doc.output('dataurlstring');
  }
}