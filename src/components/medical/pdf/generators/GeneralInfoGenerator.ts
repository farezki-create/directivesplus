
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for the general information section of the PDF
 */
export class GeneralInfoGenerator {
  /**
   * Generates the general information section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Informations générales", y);
    
    if (data.nom) {
      y = PDFDocumentLayout.addField(pdfDoc, "Nom", data.nom, y);
    }
    
    if (data.prenom) {
      y = PDFDocumentLayout.addField(pdfDoc, "Prénom", data.prenom, y);
    }
    
    if (data.date_naissance) {
      y = PDFDocumentLayout.addField(pdfDoc, "Date de naissance", data.date_naissance, y);
    }
    
    if (data.adresse) {
      y = PDFDocumentLayout.addField(pdfDoc, "Adresse", data.adresse, y);
    }
    
    if (data.telephone) {
      y = PDFDocumentLayout.addField(pdfDoc, "Téléphone", data.telephone, y);
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
