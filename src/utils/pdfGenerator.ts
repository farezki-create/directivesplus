
import { buildPDF } from "./pdfGenerator/pdfBuilder";
import { logPdfGenerationData } from "./pdfGenerator/dataProcessor";
import { PdfData } from "./pdfGenerator/types";

// Re-export the PdfData interface for backward compatibility
export type { PdfData };

// Main PDF generation function
export const generatePDF = async (data: PdfData): Promise<string> => {
  try {
    logPdfGenerationData(data);
    
    // Create PDF using the builder
    const pdf = buildPDF(data);
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    if (!pdfOutput || pdfOutput.length === 0) {
      throw new Error("Le PDF généré est vide");
    }
    
    return pdfOutput;
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    throw error;
  }
};
