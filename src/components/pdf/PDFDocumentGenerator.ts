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

    // Generate User Section
    yPosition = PDFUserSection.generate(doc, profile, yPosition);

    // Generate Trusted Person Section
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Generate Responses Section
    yPosition = PDFResponsesSection.generate(doc, responses, yPosition);

    // Generate Synthesis Section
    yPosition = PDFSynthesisSection.generate(doc, responses, yPosition);

    // Date and signature
    yPosition += 15;
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.setFontSize(12);
    doc.text(`Fait le ${currentDate}`, 20, yPosition);
    yPosition += 20;
    doc.text("Signature:", 20, yPosition);

    return doc.output('dataurlstring');
  }
}