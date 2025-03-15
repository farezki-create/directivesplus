import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Free text synthesis
    if (responses?.synthesis?.free_text) {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      doc.setFontSize(12);
      doc.text("Expression libre :", 20, yPosition);
      yPosition += 7;

      const synthesisText = responses.synthesis.free_text;
      const lines = doc.splitTextToSize(synthesisText, pageWidth - 40);
      
      // Check if we need multiple pages for the synthesis text
      let currentLine = 0;
      while (currentLine < lines.length) {
        // Check remaining space on current page
        const remainingLines = Math.floor((doc.internal.pageSize.getHeight() - yPosition - 20) / 7);
        const linesToAdd = Math.min(remainingLines, lines.length - currentLine);

        // Add lines that fit on current page
        const pageLines = lines.slice(currentLine, currentLine + linesToAdd);
        doc.text(pageLines, 20, yPosition);
        
        currentLine += linesToAdd;
        yPosition += linesToAdd * 7;

        // If there are more lines, add a new page
        if (currentLine < lines.length) {
          doc.addPage();
          yPosition = 20;
        }
      }
    }

    return yPosition;
  }
}