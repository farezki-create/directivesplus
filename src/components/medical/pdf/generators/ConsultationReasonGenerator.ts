
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for the consultation reason section of the PDF
 */
export class ConsultationReasonGenerator {
  /**
   * Generates the consultation reason section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Motif de consultation", y);
    
    if (data.motif) {
      y = PDFDocumentLayout.addField(pdfDoc, "Motif principal", data.motif, y);
    }
    
    if (data.debut_symptomes) {
      y = PDFDocumentLayout.addField(pdfDoc, "Début des symptômes", data.debut_symptomes, y);
    }
    
    if (data.evolution) {
      y = PDFDocumentLayout.addField(pdfDoc, "Évolution", data.evolution, y);
    }
    
    if (data.details_motif) {
      y = PDFDocumentLayout.addField(pdfDoc, "Précisions", data.details_motif, y);
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
