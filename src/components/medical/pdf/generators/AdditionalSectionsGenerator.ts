
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "../PDFDocumentLayout";

/**
 * Generator for additional sections of the PDF
 */
export class AdditionalSectionsGenerator {
  /**
   * Generates additional sections of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the sections
   */
  static generate(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    // Traitements
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Traitements en cours", y);
    
    if (data.traitements) {
      y = PDFDocumentLayout.addField(pdfDoc, "Médicaments", data.traitements, y);
    }
    
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    
    // Antécédents familiaux
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Antécédents familiaux", y);
    
    if (data.famille && data.famille.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Maladies familiales", 
        data.famille.join(", "), 
        y
      );
    }
    
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    
    // Mode de vie
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Mode de vie", y);
    
    if (data.tabac !== undefined) {
      y = PDFDocumentLayout.addField(pdfDoc, "Fumeur", data.tabac ? "Oui" : "Non", y);
    }
    
    if (data.alcool !== undefined) {
      y = PDFDocumentLayout.addField(pdfDoc, "Consommation d'alcool", data.alcool ? "Oui" : "Non", y);
    }
    
    if (data.drogues !== undefined) {
      y = PDFDocumentLayout.addField(pdfDoc, "Consommation de drogues", data.drogues ? "Oui" : "Non", y);
    }
    
    if (data.activite_physique !== undefined) {
      y = PDFDocumentLayout.addField(pdfDoc, "Activité physique régulière", data.activite_physique ? "Oui" : "Non", y);
    }
    
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    
    // Particularités
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Dispositifs médicaux et directives", y);
    
    if (data.dispositifs) {
      y = PDFDocumentLayout.addField(pdfDoc, "Dispositifs médicaux implantés", data.dispositifs, y);
    }
    
    if (data.directives) {
      y = PDFDocumentLayout.addField(pdfDoc, "Directives anticipées et personne de confiance", data.directives, y);
    }
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
}
