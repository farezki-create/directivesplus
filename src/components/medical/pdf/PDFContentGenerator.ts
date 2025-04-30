
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { PDFDocumentLayout } from "./PDFDocumentLayout";

/**
 * Responsible for generating PDF content from medical data
 */
export class PDFContentGenerator {
  /**
   * Generates the general information section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding the section
   */
  static generateGeneralInfo(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "1. Informations générales", y);
    
    if (data.nom) y = PDFDocumentLayout.addField(pdfDoc, "Nom", data.nom, y);
    if (data.prenom) y = PDFDocumentLayout.addField(pdfDoc, "Prénom", data.prenom, y);
    if (data.date_naissance) y = PDFDocumentLayout.addField(pdfDoc, "Date de naissance", data.date_naissance, y);
    if (data.sexe) y = PDFDocumentLayout.addField(pdfDoc, "Sexe", data.sexe, y);
    if (data.secu) y = PDFDocumentLayout.addField(pdfDoc, "Numéro de sécurité sociale", data.secu, y);
    if (data.adresse) y = PDFDocumentLayout.addField(pdfDoc, "Adresse", data.adresse, y);
    if (data.telephone) y = PDFDocumentLayout.addField(pdfDoc, "Téléphone", data.telephone, y);
    if (data.personne_prevenir) y = PDFDocumentLayout.addField(pdfDoc, "Personne à prévenir", data.personne_prevenir, y);
    
    return y + 5;
  }

  /**
   * Generates the consultation reason section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding the section
   */
  static generateConsultationReason(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "2. Motif de consultation", y);
    
    if (data.motif) y = PDFDocumentLayout.addField(pdfDoc, "Motif principal", data.motif, y);
    if (data.debut_symptomes) y = PDFDocumentLayout.addField(pdfDoc, "Début des symptômes", data.debut_symptomes, y);
    if (data.evolution) y = PDFDocumentLayout.addField(pdfDoc, "Évolution", data.evolution, y);
    
    return y + 5;
  }

  /**
   * Generates the symptoms section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding the section
   */
  static generateSymptoms(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "3. Symptômes associés", y);
    
    if (data.symptomes && data.symptomes.length > 0) {
      y = PDFDocumentLayout.addField(pdfDoc, "Symptômes", data.symptomes.join(', '), y);
    }
    if (data.autres_symptomes) {
      y = PDFDocumentLayout.addField(pdfDoc, "Autres symptômes", data.autres_symptomes, y);
    }
    
    return y + 5;
  }

  /**
   * Generates the medical history section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding the section
   */
  static generateMedicalHistory(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "4. Antécédents médicaux", y);
    
    if (data.pathologies && data.pathologies.length > 0) {
      y = PDFDocumentLayout.addField(pdfDoc, "Pathologies connues", data.pathologies.join(', '), y);
    }
    if (data.antecedents) {
      y = PDFDocumentLayout.addField(pdfDoc, "Autres pathologies", data.antecedents, y);
    }
    if (data.chirurgies && data.chirurgies.length > 0) {
      y = PDFDocumentLayout.addField(pdfDoc, "Chirurgies antérieures", data.chirurgies.join(', '), y);
    }
    if (data.autres_chirurgies) {
      y = PDFDocumentLayout.addField(pdfDoc, "Autres chirurgies", data.autres_chirurgies, y);
    }
    if (data.hospitalisations) {
      y = PDFDocumentLayout.addField(pdfDoc, "Hospitalisations récentes", data.hospitalisations, y);
    }
    
    return y + 5;
  }

  /**
   * Generates the allergies section of the PDF
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding the section
   */
  static generateAllergies(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "5. Allergies", y);
    
    if (data.allergies && data.allergies.length > 0) {
      y = PDFDocumentLayout.addField(pdfDoc, "Allergies connues", data.allergies.join(', '), y);
    }
    if (data.autres_allergies) {
      y = PDFDocumentLayout.addField(pdfDoc, "Autres allergies", data.autres_allergies, y);
    }
    
    return y + 5;
  }

  /**
   * Generates the additional PDF sections
   * @param pdfDoc - The jsPDF document instance
   * @param data - The medical questionnaire data
   * @param y - The initial y position
   * @returns The new y position after adding all sections
   */
  static generateAdditionalSections(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    // Treatments section
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "6. Traitements en cours", y);
    if (data.traitements) {
      y = PDFDocumentLayout.addField(pdfDoc, "Médicaments habituels", data.traitements, y);
    }
    y += 5;

    // Family history section
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "7. Antécédents familiaux", y);
    if (data.famille && data.famille.length > 0) {
      y = PDFDocumentLayout.addField(pdfDoc, "Antécédents familiaux", data.famille.join(', '), y);
    }
    y += 5;

    // Lifestyle section
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "8. Mode de vie", y);
    if (data.tabac) {
      y = PDFDocumentLayout.addField(pdfDoc, "Fumeur", data.tabac, y);
    }
    if (data.alcool) {
      y = PDFDocumentLayout.addField(pdfDoc, "Alcool", data.alcool, y);
    }
    if (data.drogues) {
      y = PDFDocumentLayout.addField(pdfDoc, "Drogues", data.drogues, y);
    }
    if (data.activite_physique) {
      y = PDFDocumentLayout.addField(pdfDoc, "Activité physique", data.activite_physique, y);
    }
    y += 5;

    // Special features section
    y = PDFDocumentLayout.checkForNewPage(pdfDoc, y);
    y = PDFDocumentLayout.addSectionHeader(pdfDoc, "9. Particularités", y);
    if (data.dispositifs) {
      y = PDFDocumentLayout.addField(pdfDoc, "Dispositifs médicaux implantés", data.dispositifs, y);
    }
    if (data.directives) {
      y = PDFDocumentLayout.addField(pdfDoc, "Directives anticipées ou personne de confiance", data.directives, y);
    }
    
    return y;
  }
}
