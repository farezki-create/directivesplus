
import { 
  createPdfDocument, 
  createPdfLayout, 
  renderChapter1, 
  fetchAndRenderMedicalDocuments, 
  addSignatureFooters, 
  validatePdfOutput 
} from "./pdfGenerator/pdfBuilder";
import { logPdfGenerationData } from "./pdfGenerator/dataProcessor";
import { PdfData } from "./pdfGenerator/types";

// Re-export the PdfData interface for backward compatibility
export type { PdfData };

// Main PDF generation function
export const generatePDF = async (data: PdfData): Promise<string> => {
  try {
    logPdfGenerationData(data);
    
    // Create new PDF document
    const pdf = createPdfDocument();
    
    // Define layout parameters
    const layout = createPdfLayout(pdf);
    
    console.log("Configuration PDF:", layout);
    
    // Render Chapter 1: Directives Anticipées
    renderChapter1(pdf, layout, data);
    
    // Fetch and render medical documents (Chapter 2)
    await fetchAndRenderMedicalDocuments(pdf, layout, data.userId);
    
    // Add signature footer on all pages
    addSignatureFooters(pdf, layout, data.signature);
    
    console.log("=== GÉNÉRATION PDF TERMINÉE ===");
    console.log("Nombre total de pages:", pdf.getNumberOfPages());
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    validatePdfOutput(pdfOutput);
    
    return pdfOutput;
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    throw error;
  }
};
