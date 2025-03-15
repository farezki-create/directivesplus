
import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // More detailed logging to help diagnose issues
    console.log("[PDFSynthesisSection] Full responses object:", responses);
    console.log("[PDFSynthesisSection] Synthesis object:", responses?.synthesis);
    console.log("[PDFSynthesisSection] Processing synthesis text:", 
      responses?.synthesis?.free_text 
        ? `Present (length: ${responses.synthesis.free_text.length})` 
        : "Not present");
    
    // Free text synthesis
    if (responses?.synthesis?.free_text) {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Expression libre :", 20, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 7;

      const synthesisText = responses.synthesis.free_text.trim();
      console.log("[PDFSynthesisSection] Synthesis text to render:", 
        synthesisText.substring(0, 50) + (synthesisText.length > 50 ? "..." : ""));
      
      // Split the text to fit within page width
      const textLines = doc.splitTextToSize(synthesisText, pageWidth - 40);
      
      console.log("[PDFSynthesisSection] Text lines to add:", textLines.length);
      
      // Calculate if we need multiple pages
      let linesProcessed = 0;
      
      while (linesProcessed < textLines.length) {
        // Calculate remaining space on current page
        const linesPerPage = Math.floor((doc.internal.pageSize.getHeight() - yPosition - 20) / 7);
        
        // Get lines that fit on current page
        const currentPageLines = textLines.slice(linesProcessed, linesProcessed + linesPerPage);
        
        // Add lines to current page
        doc.text(currentPageLines, 20, yPosition);
        
        // Update position and lines processed
        linesProcessed += currentPageLines.length;
        yPosition += currentPageLines.length * 7;
        
        // If there are more lines to process, add a new page
        if (linesProcessed < textLines.length) {
          doc.addPage();
          yPosition = 20;
        }
      }
    } else {
      console.log("[PDFSynthesisSection] No synthesis text found to add to PDF");
      // Try alternative path to synthesis text
      if (typeof responses?.synthesis === 'string' && responses.synthesis.trim().length > 0) {
        console.log("[PDFSynthesisSection] Found synthesis as string, length:", responses.synthesis.length);
        
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPosition = 20;
        }

        yPosition += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Expression libre :", 20, yPosition);
        doc.setFont("helvetica", "normal");
        yPosition += 7;

        const synthesisText = responses.synthesis.trim();
        const textLines = doc.splitTextToSize(synthesisText, pageWidth - 40);
        
        console.log("[PDFSynthesisSection] Text lines to add from string:", textLines.length);
        
        let linesProcessed = 0;
        
        while (linesProcessed < textLines.length) {
          const linesPerPage = Math.floor((doc.internal.pageSize.getHeight() - yPosition - 20) / 7);
          const currentPageLines = textLines.slice(linesProcessed, linesProcessed + linesPerPage);
          doc.text(currentPageLines, 20, yPosition);
          linesProcessed += currentPageLines.length;
          yPosition += currentPageLines.length * 7;
          
          if (linesProcessed < textLines.length) {
            doc.addPage();
            yPosition = 20;
          }
        }
      }
    }

    return yPosition;
  }
}
