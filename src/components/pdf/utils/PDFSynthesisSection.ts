
import { jsPDF } from "jspdf";

export class PDFSynthesisSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // More detailed logging to help diagnose issues
    console.log("[PDFSynthesisSection] Starting with yPosition:", startY);
    console.log("[PDFSynthesisSection] Synthesis data type:", typeof responses?.synthesis);
    
    // Extract the synthesis text, handling different formats
    let synthesisText: string | null = null;
    
    if (responses?.synthesis) {
      console.log("[PDFSynthesisSection] Synthesis format:", 
        typeof responses.synthesis === 'object' ? 'object' : 
        typeof responses.synthesis === 'string' ? 'string' : 
        'unknown');
      
      if (typeof responses.synthesis === 'object' && responses.synthesis.free_text) {
        synthesisText = responses.synthesis.free_text.trim();
        console.log("[PDFSynthesisSection] Using free_text from object, length:", synthesisText.length);
      } else if (typeof responses.synthesis === 'string') {
        synthesisText = responses.synthesis.trim();
        console.log("[PDFSynthesisSection] Using string directly, length:", synthesisText.length);
      } else {
        console.log("[PDFSynthesisSection] Synthesis exists but format is unexpected:", 
          typeof responses.synthesis);
          
        // Try to extract free_text if it's buried in another object
        if (typeof responses.synthesis === 'object') {
          // Log object keys to help debug
          console.log("[PDFSynthesisSection] Object keys:", Object.keys(responses.synthesis));
          
          // Try to find free_text in nested structure
          for (const key in responses.synthesis) {
            if (typeof responses.synthesis[key] === 'object' && responses.synthesis[key]?.free_text) {
              synthesisText = responses.synthesis[key].free_text.trim();
              console.log("[PDFSynthesisSection] Found free_text in nested object:", key);
              break;
            }
          }
        }
      }
    } else {
      console.log("[PDFSynthesisSection] No synthesis data provided");
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
