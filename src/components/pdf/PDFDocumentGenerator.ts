import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { PDFSynthesisSection } from "./utils/PDFSynthesisSection";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with responses:", responses);
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text("Directives Anticipées", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Section 1: User Identity
    doc.setFontSize(16);
    doc.text("1. Identité", 20, yPosition);
    yPosition += 10;
    yPosition = PDFUserSection.generate(doc, profile, yPosition);

    // Section 2: Questionnaire Synthesis
    yPosition += 20;
    doc.setFontSize(16);
    doc.text("2. Synthèse du questionnaire", 20, yPosition);
    yPosition += 10;
    yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    yPosition = PDFSynthesisSection.generate(doc, responses, yPosition);

    // Section 3: Trusted Person
    yPosition += 20;
    doc.setFontSize(16);
    doc.text("3. Personne de confiance", 20, yPosition);
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Section 4: Date and Signature
    yPosition += 20;
    doc.setFontSize(16);
    doc.text("4. Date et signature", 20, yPosition);
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