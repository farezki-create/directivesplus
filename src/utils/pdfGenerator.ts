
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
  medicalDocuments?: any[];
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
    console.log("=== DÉBUT GÉNÉRATION PDF ===");
    console.log("Génération du PDF avec les données:", data);
    console.log("UserId fourni:", data.userId);
    
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
    
    // RÉCUPÉRATION ET AJOUT DES DOCUMENTS MÉDICAUX (SIMPLIFIÉE)
    console.log("=== RÉCUPÉRATION DOCUMENTS MÉDICAUX ===");
    console.log("UserId disponible:", data.userId);
    
    let medicalDocuments: any[] = [];
    
    if (data.userId) {
      console.log("Récupération des documents médicaux...");
      try {
        medicalDocuments = await getMedicalDocuments(data.userId);
        console.log("Documents médicaux récupérés:", medicalDocuments.length);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents médicaux:", error);
        medicalDocuments = [];
      }
    }
    
    // Ajouter aussi les documents passés en paramètre
    if (data.medicalDocuments && data.medicalDocuments.length > 0) {
      console.log("Documents médicaux fournis en paramètre:", data.medicalDocuments.length);
      medicalDocuments = [...medicalDocuments, ...data.medicalDocuments];
    }
    
    // RENDU DES DOCUMENTS MÉDICAUX
    if (medicalDocuments && medicalDocuments.length > 0) {
      console.log("=== AJOUT DES DOCUMENTS MÉDICAUX AU PDF ===");
      console.log("Nombre de documents à ajouter:", medicalDocuments.length);
      
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderMedicalDocuments(pdf, layout, yPosition, medicalDocuments);
      
      console.log("Documents médicaux ajoutés avec succès au PDF");
    } else {
      console.log("=== AUCUN DOCUMENT MÉDICAL À AJOUTER ===");
    }
    
    // Add signature
    if (data.signature) {
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderSignature(pdf, layout, yPosition, data.signature);
    }
    
    // Add signature footer on all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addSignatureFooter(pdf, layout, data.signature || null);
    }
    
    console.log("=== GÉNÉRATION PDF TERMINÉE ===");
    console.log("Nombre total de pages:", totalPages);
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    if (!pdfOutput || typeof pdfOutput !== 'string' || pdfOutput.length < 100) {
      throw new Error("La génération du PDF a échoué, sortie invalide");
    }
    
    // Ne plus sauvegarder automatiquement ici - la sauvegarde sera gérée par saveDirectivesWithDualStorage
    console.log("PDF généré avec succès, prêt pour la sauvegarde externe");
    
    return pdfOutput;
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    throw error;
  }
};
