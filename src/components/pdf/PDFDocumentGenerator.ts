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

    // Section 2: Access Code
    yPosition += 20;
    doc.setFontSize(16);
    doc.text("2. Code d'accès au document", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Code d'accès : ${profile.unique_identifier}`, 20, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // For trusted person document, skip directives anticipées section
    if (!isTrustedPersonDoc) {
      // Section 3: Directives Anticipées Synthesis
      yPosition += 20;
      doc.setFontSize(16);
      doc.text("3. Synthèse de mes directives anticipées", 20, yPosition);
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
      isTrustedPersonDoc ? "3. Personne de confiance" : "4. Personne de confiance",
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

    // Final Section: Date, Place and Signature
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      isTrustedPersonDoc ? "4. Date, lieu et signature" : "5. Date, lieu et signature",
      20,
      yPosition
    );
    yPosition += 10;
    
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.setFontSize(12);
    doc.text(`Fait le ${currentDate}`, 20, yPosition);
    yPosition += 20;
    doc.text("À : _____________________", 20, yPosition);
    yPosition += 20;
    doc.text("Signature :", 20, yPosition);

    return doc.output('dataurlstring');
  }
}