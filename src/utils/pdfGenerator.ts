
import { jsPDF } from "jspdf";
import { 
  PdfLayout, 
  renderHeader, 
  renderPersonalInfo, 
  renderTrustedPersons, 
  renderQuestionnaires, 
  renderPhrases, 
  renderFreeText, 
  renderSignature, 
  addSignatureFooter, 
  checkPageBreak 
} from "./pdfSections";
import { savePdfToDatabase } from "./pdfStorage";

// Interface for PDF generation data
export interface PdfData {
  profileData: any;
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
  signature: string;
  userId?: string;
}

// Function to translate response strings from English to French
const translateResponse = (response: string): string => {
  if (!response) return 'Pas de réponse';
  
  const lowerResponse = response.toLowerCase().trim();
  
  switch (lowerResponse) {
    case 'yes':
      return 'Oui';
    case 'no':
      return 'Non';
    case 'unsure':
      return 'Incertain';
    default:
      return response;
  }
};

// Main PDF generation function
export const generatePDF = async (data: PdfData): Promise<any> => {
  try {
    console.log("Génération du PDF avec les données:", data);
    
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    
    // Define layout parameters
    const layout: PdfLayout = {
      margin: 20,
      pageWidth: pdf.internal.pageSize.getWidth(),
      pageHeight: pdf.internal.pageSize.getHeight(),
      lineHeight: 7,
      contentWidth: pdf.internal.pageSize.getWidth() - 40, // 2x margins
      footerHeight: 20
    };
    
    // Start position for content
    let yPosition = 20;
    
    // Render document header
    yPosition = renderHeader(pdf, layout, yPosition);
    
    // Render personal information section
    yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
    yPosition = renderPersonalInfo(pdf, layout, yPosition, data.profileData);
    
    // Render trusted persons section
    yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
    yPosition = renderTrustedPersons(pdf, layout, yPosition, data.trustedPersons);
    
    // Add signature after trusted persons section if available
    if (data.signature) {
      yPosition = checkPageBreak(pdf, layout, yPosition, 30);
      yPosition = renderSignature(pdf, layout, yPosition, data.signature);
    }
    
    // Render questionnaire responses
    yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
    yPosition = renderQuestionnaires(pdf, layout, yPosition, data.responses, translateResponse);
    
    // Render example phrases if available
    if (data.examplePhrases && data.examplePhrases.length > 0) {
      yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
      yPosition = renderPhrases(pdf, layout, yPosition, data.examplePhrases, "Phrases d'exemples sélectionnées");
    }
    
    // Render custom phrases if available
    if (data.customPhrases && data.customPhrases.length > 0) {
      yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
      yPosition = renderPhrases(pdf, layout, yPosition, data.customPhrases, "Phrases personnalisées");
    }
    
    // Render free text section if available
    if (data.freeText) {
      yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 10);
      yPosition = renderFreeText(pdf, layout, yPosition, data.freeText);
    }
    
    // Add signature footer on the last page
    addSignatureFooter(pdf, layout, data.signature);
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    // Store PDF in database if userId is provided
    if (data.userId) {
      const description = "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return await savePdfToDatabase({
        userId: data.userId,
        pdfOutput,
        description
      });
    }
    
    return Promise.resolve(null);
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    return Promise.reject(error);
  }
};
