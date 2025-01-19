import { jsPDF } from "jspdf";

export class PDFSignatureSection {
  static generate(doc: jsPDF, yPosition: number): number {
    const signatureData = localStorage.getItem('userSignature');
    
    // Ensure there's enough space for the signature
    const requiredSpace = 80; // Space needed for signature
    if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
    
    if (signatureData) {
      console.log("[PDFGenerator] Adding signature to PDF");
      doc.text("Signature :", 20, yPosition);
      yPosition += 10;
      try {
        // Calculate signature dimensions to maintain aspect ratio
        const maxWidth = 100;
        const maxHeight = 60;
        const img = new Image();
        img.src = signatureData;
        let width = maxWidth;
        let height = (img.height * maxWidth) / img.width;
        
        if (height > maxHeight) {
          height = maxHeight;
          width = (img.width * maxHeight) / img.height;
        }
        
        doc.addImage(signatureData, 'PNG', 20, yPosition, width, height);
        yPosition += height + 10;
      } catch (error) {
        console.error("[PDFGenerator] Error adding signature:", error);
        doc.text("(Erreur lors de l'ajout de la signature)", 20, yPosition);
        yPosition += 20;
      }
    } else {
      console.log("[PDFGenerator] No signature found, adding placeholder");
      doc.text("Signature :", 20, yPosition);
      yPosition += 40;
    }
    
    return yPosition;
  }
}