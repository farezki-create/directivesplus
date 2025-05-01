
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "./PDFDocumentLayout";

/**
 * Utility class for generating PDF content from medical questionnaire data
 */
export class PDFContentGenerator {
  /**
   * Generates the general information section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generateGeneralInfo(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
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
  
  /**
   * Generates the consultation reason section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generateConsultationReason(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
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
  
  /**
   * Generates the symptoms section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generateSymptoms(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
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
  
  /**
   * Generates the medical history section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generateMedicalHistory(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
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
  
  /**
   * Generates the allergies section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the section
   */
  static generateAllergies(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "Allergies", y);
    
    if (data.allergies && data.allergies.length > 0) {
      y = PDFDocumentLayout.addField(
        pdfDoc, 
        "Allergies connues", 
        data.allergies.join(", "), 
        y
      );
    }
    
    // Removed reference to autres_allergies as it doesn't exist in the schema
    
    return PDFDocumentLayout.checkForNewPage(pdfDoc, y);
  }
  
  /**
   * Generates additional sections of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The starting y position
   * @returns The new y position after adding the sections
   */
  static generateAdditionalSections(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
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
    
    if (data.tabac) {
      y = PDFDocumentLayout.addField(pdfDoc, "Fumeur", data.tabac === "oui" ? "Oui" : "Non", y);
    }
    
    if (data.alcool) {
      y = PDFDocumentLayout.addField(pdfDoc, "Consommation d'alcool", data.alcool === "oui" ? "Oui" : "Non", y);
    }
    
    if (data.drogues) {
      y = PDFDocumentLayout.addField(pdfDoc, "Consommation de drogues", data.drogues === "oui" ? "Oui" : "Non", y);
    }
    
    if (data.activite_physique) {
      y = PDFDocumentLayout.addField(pdfDoc, "Activité physique régulière", data.activite_physique === "oui" ? "Oui" : "Non", y);
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
