
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

export const addSignatureFooter = (pdf: jsPDF, layout: PdfLayout, signature: string | null): void => {
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
