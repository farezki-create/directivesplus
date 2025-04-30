
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../pdf/PDFDocumentLayout";
import { PDFContentGenerator } from "../pdf/PDFContentGenerator";

/**
 * Hook for generating PDF documents from medical questionnaire data
 */
export function usePDFGeneration() {
  /**
   * Generates a PDF document from medical questionnaire data
   * @param data - The medical questionnaire data
   * @returns The generated PDF as a data URL string
   */
  const generatePDF = (data: MedicalQuestionnaireData) => {
    // Create a new PDF document
    const pdfDoc = new jsPDF();
    
    // Add title
    let y = 20;
    y = PDFDocumentLayout.addTitle(pdfDoc, "Questionnaire médical préalable", y);
    y += 20;
    
    // Generate document sections
    y = PDFContentGenerator.generateGeneralInfo(pdfDoc, data, y);
    y = PDFContentGenerator.generateConsultationReason(pdfDoc, data, y);
    y = PDFContentGenerator.generateSymptoms(pdfDoc, data, y);
    y = PDFContentGenerator.generateMedicalHistory(pdfDoc, data, y);
    y = PDFContentGenerator.generateAllergies(pdfDoc, data, y);
    y = PDFContentGenerator.generateAdditionalSections(pdfDoc, data, y);
    
    // Add page numbers
    const totalPages = pdfDoc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdfDoc.setPage(i);
      pdfDoc.setFontSize(10);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text(`Page ${i} / ${totalPages}`, 190, 285, { align: "right" });
    }
    
    // Return the PDF as a data URL string
    return pdfDoc.output('dataurlstring');
  };

  return { generatePDF };
}

// Export the PDFDocumentLayout and PDFContentGenerator for potential reuse
export { PDFDocumentLayout, PDFContentGenerator };
