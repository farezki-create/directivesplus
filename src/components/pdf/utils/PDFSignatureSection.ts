import { jsPDF } from "jspdf";

export class PDFSignatureSection {
  static generate(doc: jsPDF, yPosition: number): number {
    doc.text("Fait à _________________, le _________________", 20, yPosition);
    return yPosition + 40;
  }
}