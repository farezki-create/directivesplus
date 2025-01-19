import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, yPosition: number): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Synthesis
    if (responses?.synthesis?.free_text) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Synthèse et expression libre:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      const synthesisText = responses.synthesis.free_text;
      const lines = doc.splitTextToSize(synthesisText, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 7;
    }

    return yPosition;
  }
}