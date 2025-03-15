
import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // More detailed logging to help diagnose issues
    console.log("[PDFSynthesisSection] Starting with yPosition:", startY);
    console.log("[PDFSynthesisSection] Synthesis object type:", typeof responses?.synthesis);
    
    if (responses?.synthesis) {
      if (typeof responses.synthesis === 'object') {
        console.log("[PDFSynthesisSection] Synthesis object keys:", Object.keys(responses.synthesis));
        console.log("[PDFSynthesisSection] Free text present:", !!responses.synthesis.free_text);
        if (responses.synthesis.free_text) {
          console.log("[PDFSynthesisSection] Free text length:", responses.synthesis.free_text.length);
          console.log("[PDFSynthesisSection] Sample:", 
            responses.synthesis.free_text.substring(0, 50) + "...");
        }
      } else if (typeof responses.synthesis === 'string') {
        console.log("[PDFSynthesisSection] Synthesis is string, length:", responses.synthesis.length);
        console.log("[PDFSynthesisSection] Sample:", 
          responses.synthesis.substring(0, 50) + "...");
      }
    } else {
      console.log("[PDFSynthesisSection] No synthesis data provided");
    }
    
    // Extract the synthesis text, handling different formats
    let synthesisText: string | null = null;
    
    if (responses?.synthesis) {
      if (typeof responses.synthesis === 'object' && responses.synthesis.free_text) {
        synthesisText = responses.synthesis.free_text.trim();
      } else if (typeof responses.synthesis === 'string') {
        synthesisText = responses.synthesis.trim();
      }
    }
    
    // Process synthesis text if available
    if (synthesisText && synthesisText.length > 0) {
      console.log("[PDFSynthesisSection] Processing synthesis text, length:", synthesisText.length);
      
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
      
      console.log("[PDFSynthesisSection] Finished adding synthesis text at yPosition:", yPosition);
    } else {
      console.log("[PDFSynthesisSection] No synthesis text found to add to PDF");
    }

    return yPosition;
  }
}
