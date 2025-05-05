
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

/**
 * Hook for generating CSV content from medical questionnaire data
 */
export function useCSVGeneration() {
  const generateCSV = (data: MedicalQuestionnaireData) => {
    // Generate CSV content
    const headers = Object.keys(data).filter(key => {
      const value = data[key as keyof MedicalQuestionnaireData];
      if (value === undefined || value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value !== '';
      return true; // Keep boolean values regardless of their value
    });
    
    const values = headers.map(header => {
      const value = data[header as keyof MedicalQuestionnaireData];
      if (Array.isArray(value)) {
        return `"${value.join(' | ').replace(/"/g, '""')}"`;
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    
    return `${headers.join(",")}\n${values.join(",")}`;
  };

  return { generateCSV };
}
