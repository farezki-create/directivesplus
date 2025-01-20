import { jsPDF } from "jspdf";

export class PDFSignatureSection {
  static generate(doc: jsPDF, signatureData: string | null, yPosition: number): number {
    if (signatureData) {
      try {
        const img = new Image();
        img.src = signatureData;
        
        const maxWidth = 80;
        const maxHeight = 40;
        
        const aspectRatio = img.width / img.height;
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        console.log("[PDFSignatureSection] Adding signature with dimensions:", { width, height });
        doc.addImage(signatureData, 'PNG', 20, yPosition, width, height);
      } catch (error) {
        console.error("[PDFSignatureSection] Error adding signature:", error);
        doc.text("Signature :", 20, yPosition);
      }
    } else {
      doc.text("Signature :", 20, yPosition);
    }
    
    return yPosition + 40;
  }
}