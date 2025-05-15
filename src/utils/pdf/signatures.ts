
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

export const renderSignature = (pdf: jsPDF, layout: PdfLayout, yPosition: number, signature: string): number => {
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("SIGNATURE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  // Add the signature image if available
  if (signature) {
    try {
      pdf.addImage(signature, 'PNG', 20, yPosition, 60, 30);
      yPosition += 35;
      
      // Add date below signature
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
      yPosition += layout.lineHeight;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la signature:", error);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      pdf.text("Signature numérique non disponible", 20, yPosition);
      yPosition += layout.lineHeight * 2;
    }
  } else {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "italic");
    pdf.text("Pas de signature", 20, yPosition);
    yPosition += layout.lineHeight * 2;
  }
  
  return yPosition;
};

export const addSignatureFooter = (pdf: jsPDF, layout: PdfLayout, signature: string): void => {
  if (!signature) return;
  
  const footerY = layout.pageHeight - layout.footerHeight;
  
  try {
    // Add a small version of the signature at the bottom of the page
    pdf.addImage(signature, 'PNG', 20, footerY, 30, 15);
    
    // Add date next to signature
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Document signé le ${new Date().toLocaleDateString('fr-FR')}`, 55, footerY + 10);
    
    // Add page numbers
    const pageNumber = pdf.getCurrentPageInfo().pageNumber;
    const totalPages = pdf.getNumberOfPages();
    pdf.text(`Page ${pageNumber}/${totalPages}`, layout.pageWidth - 40, footerY + 10);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la signature au pied de page:", error);
  }
};
