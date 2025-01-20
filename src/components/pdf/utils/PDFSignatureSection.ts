import { jsPDF } from "jspdf";

export class PDFSignatureSection {
  static generate(doc: jsPDF, signatureData: string | null, yPosition: number): number {
    if (signatureData) {
      try {
        const img = new Image();
        img.src = signatureData;
        
        const maxWidth = 120; // Increased width for better visibility
        const maxHeight = 60; // Increased height for better visibility
        
        const aspectRatio = img.width / img.height;
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        console.log("[PDFSignatureSection] Adding electronic signature with dimensions:", { width, height });
        doc.addImage(signatureData, 'PNG', 20, yPosition, width, height);
      } catch (error) {
        console.error("[PDFSignatureSection] Error adding signature:", error);
        doc.text("Signature électronique non disponible", 20, yPosition);
      }
    } else {
      doc.text("Signature électronique non disponible", 20, yPosition);
    }
    
    return yPosition + 40;
  }
}