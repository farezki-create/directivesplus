
import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    // Simply return the starting position as we're not adding any content
    // This effectively removes the free text section from the PDF
    return startY;
  }
}
