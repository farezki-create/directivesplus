
import { jsPDF } from "jspdf";
import { 
  PdfLayout, 
  renderHeader, 
  renderPersonalInfo, 
  renderTrustedPersons, 
  renderQuestionnaires, 
  renderFreeText, 
  renderSignature, 
  addSignatureFooter, 
  checkPageBreak 
} from "./pdf";
import { getMedicalDocuments, renderMedicalDocuments } from "./pdf/medicalDocuments";
import { savePdfToDatabase } from "./pdfStorage";

// Interface for PDF generation data
export interface PdfData {
  profileData: any;
  responses: Record<string, any>;
  examplePhrases: string[];
  customPhrases: string[];
  trustedPersons: any[];
  freeText: string;
  signature: string | null;
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
export const generatePDF = async (data: PdfData): Promise<string> => {
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
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderPersonalInfo(pdf, layout, yPosition, data.profileData);
    
    // Render trusted persons section
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderTrustedPersons(pdf, layout, yPosition, data.trustedPersons);
    
    // Render questionnaire responses
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderQuestionnaires(pdf, layout, yPosition, data.responses, translateResponse);

    // Render free text section if available
    if (data.freeText) {
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderFreeText(pdf, layout, yPosition, data.freeText);
    }
    
    // Add signature BEFORE medical documents
    if (data.signature) {
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderSignature(pdf, layout, yPosition, data.signature);
    }
    
    // Récupérer et ajouter les documents médicaux APRÈS la signature, à la fin
    if (data.userId) {
      console.log("Récupération des documents médicaux pour l'utilisateur:", data.userId);
      const medicalDocuments = await getMedicalDocuments(data.userId);
      console.log("Documents médicaux récupérés:", medicalDocuments);
      
      if (medicalDocuments.length > 0) {
        console.log("Ajout des documents médicaux au PDF");
        yPosition = checkPageBreak(pdf, layout, yPosition);
        yPosition = renderMedicalDocuments(pdf, layout, yPosition, medicalDocuments);
        console.log("Documents médicaux ajoutés, nouvelle position Y:", yPosition);
      } else {
        console.log("Aucun document médical trouvé");
      }
    } else {
      console.log("Pas d'userId fourni, pas de récupération de documents médicaux");
    }
    
    // Add signature footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addSignatureFooter(pdf, layout, data.signature || null);
    }
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    if (!pdfOutput || typeof pdfOutput !== 'string' || pdfOutput.length < 100) {
      throw new Error("La génération du PDF a échoué, sortie invalide");
    }
    
    // Store PDF in database if userId is provided
    if (data.userId) {
      const description = "Directives anticipées générées le " + new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      await savePdfToDatabase({
        userId: data.userId,
        pdfOutput,
        description
      });
    }
    
    return pdfOutput;
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    throw error;
  }
};
