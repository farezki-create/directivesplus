
import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title for the synthesis section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ma synthèse", 20, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 10;
    
    // Free text synthesis
    if (responses?.synthesis?.free_text) {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      const synthesisText = responses.synthesis.free_text;
      
      // Split synthesis into sections if it contains "PERSONNE DE CONFIANCE"
      if (synthesisText.includes("PERSONNE DE CONFIANCE")) {
        const parts = synthesisText.split("PERSONNE DE CONFIANCE");
        const mainText = parts[0].trim();
        
        // Process main text (free text and examples)
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(mainText, pageWidth - 40);
        
        // Check if we need multiple pages for the synthesis text
        let currentLine = 0;
        while (currentLine < lines.length) {
          // Check remaining space on current page
          const remainingLines = Math.floor((doc.internal.pageSize.getHeight() - yPosition - 20) / 6);
          const linesToAdd = Math.min(remainingLines, lines.length - currentLine);

          // Add lines that fit on current page
          const pageLines = lines.slice(currentLine, currentLine + linesToAdd);
          doc.text(pageLines, 20, yPosition);
          
          currentLine += linesToAdd;
          yPosition += linesToAdd * 6;

          // If there are more lines, add a new page
          if (currentLine < lines.length) {
            doc.addPage();
            yPosition = 20;
          }
        }
        
        // Note: The "PERSONNE DE CONFIANCE" part will be handled by PDFTrustedPersonSection
      } else {
        // Process the whole text if there's no "PERSONNE DE CONFIANCE" section
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(synthesisText, pageWidth - 40);
        
        // Check if we need multiple pages for the synthesis text
        let currentLine = 0;
        while (currentLine < lines.length) {
          // Check remaining space on current page
          const remainingLines = Math.floor((doc.internal.pageSize.getHeight() - yPosition - 20) / 6);
          const linesToAdd = Math.min(remainingLines, lines.length - currentLine);

          // Add lines that fit on current page
          const pageLines = lines.slice(currentLine, currentLine + linesToAdd);
          doc.text(pageLines, 20, yPosition);
          
          currentLine += linesToAdd;
          yPosition += linesToAdd * 6;

          // If there are more lines, add a new page
          if (currentLine < lines.length) {
            doc.addPage();
            yPosition = 20;
          }
        }
      }
      
      yPosition += 10; // Add extra space after synthesis section
    }

    return yPosition;
  }
}
