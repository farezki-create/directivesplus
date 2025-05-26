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
import { getMedicalDocuments, renderMedicalDocumentsChapter } from "./pdf/medicalDocuments/index";

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
    console.log("Données reçues pour le PDF:", {
      hasProfileData: !!data.profileData,
      profileData: data.profileData,
      hasResponses: !!data.responses,
      responsesCount: Object.keys(data.responses || {}).length,
      responses: data.responses,
      hasExamplePhrases: !!data.examplePhrases,
      examplePhrasesCount: data.examplePhrases?.length || 0,
      hasCustomPhrases: !!data.customPhrases,
      customPhrasesCount: data.customPhrases?.length || 0,
      hasTrustedPersons: !!data.trustedPersons,
      trustedPersonsCount: data.trustedPersons?.length || 0,
      trustedPersons: data.trustedPersons,
      hasFreeText: !!data.freeText,
      freeTextLength: data.freeText?.length || 0,
      hasSignature: !!data.signature,
      userId: data.userId
    });
    
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
    
    console.log("Configuration PDF:", layout);
    
    // ==========================================
    // CHAPITRE 1: DIRECTIVES ANTICIPÉES
    // ==========================================
    
    // Start position for content
    let yPosition = 20;
    
    // Titre du chapitre principal
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("CHAPITRE 1", layout.pageWidth / 2, yPosition, { align: "center" });
    yPosition += layout.lineHeight * 1.5;
    
    // Render document header
    console.log("Rendu de l'en-tête...");
    yPosition = renderHeader(pdf, layout, yPosition);
    console.log("En-tête rendu, nouvelle position Y:", yPosition);
    
    // Render personal information section
    console.log("Rendu des informations personnelles...");
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderPersonalInfo(pdf, layout, yPosition, data.profileData);
    console.log("Informations personnelles rendues, nouvelle position Y:", yPosition);
    
    // Render trusted persons section
    console.log("Rendu des personnes de confiance...");
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderTrustedPersons(pdf, layout, yPosition, data.trustedPersons);
    console.log("Personnes de confiance rendues, nouvelle position Y:", yPosition);
    
    // Render questionnaire responses
    console.log("Rendu des réponses au questionnaire...");
    yPosition = checkPageBreak(pdf, layout, yPosition);
    yPosition = renderQuestionnaires(pdf, layout, yPosition, data.responses, translateResponse);
    console.log("Réponses rendues, nouvelle position Y:", yPosition);

    // Render free text section if available
    if (data.freeText) {
      console.log("Rendu du texte libre...");
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderFreeText(pdf, layout, yPosition, data.freeText);
      console.log("Texte libre rendu, nouvelle position Y:", yPosition);
    }
    
    // Add signature for Chapter 1
    if (data.signature) {
      console.log("Rendu de la signature...");
      yPosition = checkPageBreak(pdf, layout, yPosition);
      yPosition = renderSignature(pdf, layout, yPosition, data.signature);
      console.log("Signature rendue, nouvelle position Y:", yPosition);
    }
    
    // ==========================================
    // RÉCUPÉRATION DES DOCUMENTS MÉDICAUX
    // ==========================================
    console.log("=== RÉCUPÉRATION DOCUMENTS MÉDICAUX ===");
    console.log("UserId disponible:", data.userId);
    
    let medicalDocuments: any[] = [];
    
    if (data.userId) {
      console.log("Récupération des documents médicaux...");
      try {
        medicalDocuments = await getMedicalDocuments(data.userId);
        console.log("Documents médicaux récupérés:", medicalDocuments.length);
        console.log("Détails des documents:", medicalDocuments);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents médicaux:", error);
        medicalDocuments = [];
      }
    }
    
    // ==========================================
    // CHAPITRE 2: DOCUMENTS MÉDICAUX ANNEXES
    // ==========================================
    if (medicalDocuments && medicalDocuments.length > 0) {
      console.log("=== AJOUT DU CHAPITRE DOCUMENTS MÉDICAUX ===");
      console.log("Nombre de documents à ajouter:", medicalDocuments.length);
      
      renderMedicalDocumentsChapter(pdf, layout, medicalDocuments);
      
      console.log("Chapitre des documents médicaux ajouté avec succès");
    } else {
      console.log("=== AUCUN DOCUMENT MÉDICAL À AJOUTER ===");
    }
    
    // Add signature footer on all pages
    const totalPages = pdf.getNumberOfPages();
    console.log("Ajout des pieds de page sur", totalPages, "page(s)");
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addSignatureFooter(pdf, layout, data.signature || null);
    }
    
    console.log("=== GÉNÉRATION PDF TERMINÉE ===");
    console.log("Nombre total de pages:", totalPages);
    
    // Generate PDF output
    const pdfOutput = pdf.output("datauristring");
    
    if (!pdfOutput || typeof pdfOutput !== 'string' || pdfOutput.length < 100) {
      console.error("Erreur: PDF généré invalide", {
        hasOutput: !!pdfOutput,
        outputType: typeof pdfOutput,
        outputLength: pdfOutput?.length || 0
      });
      throw new Error("La génération du PDF a échoué, sortie invalide");
    }
    
    console.log("PDF généré avec succès, taille:", pdfOutput.length, "caractères");
    
    return pdfOutput;
  } catch (error) {
    console.error("Erreur dans la génération du PDF:", error);
    throw error;
  }
};
