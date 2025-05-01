
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for the symptoms section of the PDF
 */
export class SymptomsGenerator {
  /**
   * Generates the symptoms section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Symptômes", y);
    
    if (data.symptomes && data.symptomes.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Symptômes signalés", 
        data.symptomes.join(", "), 
        y
      );
    }
    
    if (data.autres_symptomes) {
      y = PDFDocumentLayout.addField(pdfDoc, "Autres symptômes", data.autres_symptomes, y);
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
