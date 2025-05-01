
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { GeneralInfoGenerator } from "./generators/GeneralInfoGenerator";
import { ConsultationReasonGenerator } from "./generators/ConsultationReasonGenerator";
import { SymptomsGenerator } from "./generators/SymptomsGenerator";
import { MedicalHistoryGenerator } from "./generators/MedicalHistoryGenerator";
import { AllergiesGenerator } from "./generators/AllergiesGenerator";
import { AdditionalSectionsGenerator } from "./generators/AdditionalSectionsGenerator";

/**
 * Utility class for generating PDF content from medical questionnaire data
 */
export class PDFContentGenerator {
  /**
   * Delegates to GeneralInfoGenerator
   */
  static generateGeneralInfo(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return GeneralInfoGenerator.generate(pdfDoc, data, y);
  }
  
  /**
   * Delegates to ConsultationReasonGenerator
   */
  static generateConsultationReason(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return ConsultationReasonGenerator.generate(pdfDoc, data, y);
  }
  
  /**
   * Delegates to SymptomsGenerator
   */
  static generateSymptoms(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return SymptomsGenerator.generate(pdfDoc, data, y);
  }
  
  /**
   * Delegates to MedicalHistoryGenerator
   */
  static generateMedicalHistory(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return MedicalHistoryGenerator.generate(pdfDoc, data, y);
  }
  
  /**
   * Delegates to AllergiesGenerator
   */
  static generateAllergies(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return AllergiesGenerator.generate(pdfDoc, data, y);
  }
  
  /**
   * Delegates to AdditionalSectionsGenerator
   */
  static generateAdditionalSections(pdfDoc: jsPDF, data: MedicalQuestionnaireData, y: number): number {
    return AdditionalSectionsGenerator.generate(pdfDoc, data, y);
  }
}
