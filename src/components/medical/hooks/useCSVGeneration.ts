
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

/**
 * Hook for generating CSV content from medical questionnaire data
 */
export function useCSVGeneration() {
  const generateCSV = (data: MedicalQuestionnaireData) => {
    // Generate CSV content
    const headers = Object.keys(data).filter(key => 
      data[key as keyof MedicalQuestionnaireData] !== undefined && 
      data[key as keyof MedicalQuestionnaireData] !== null && 
      (Array.isArray(data[key as keyof MedicalQuestionnaireData]) ? 
        data[key as keyof MedicalQuestionnaireData].length > 0 : 
        data[key as keyof MedicalQuestionnaireData] !== '')
    );
    
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
