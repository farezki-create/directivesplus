
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for the medical history section of the PDF
 */
export class MedicalHistoryGenerator {
  /**
   * Generates the medical history section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Antécédents médicaux", y);
    
    if (data.pathologies && data.pathologies.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Pathologies chroniques", 
        data.pathologies.join(", "), 
        y
      );
    }
    
    if (data.chirurgies && data.chirurgies.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Antécédents chirurgicaux", 
        data.chirurgies.join(", "), 
        y
      );
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
