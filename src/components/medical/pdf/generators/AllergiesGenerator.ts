
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for the allergies section of the PDF
 */
export class AllergiesGenerator {
  /**
   * Generates the allergies section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Allergies", y);
    
    if (data.allergies && data.allergies.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Allergies connues", 
        data.allergies.join(", "), 
        y
      );
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
