
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
} from "../pdf";
import { getMedicalDocuments, renderMedicalDocumentsChapter } from "../pdf/medicalDocuments/index";
import { PdfData } from "./types";
import { translateResponse } from "./dataProcessor";

export const createPdfDocument = (): jsPDF => {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
};

export const createPdfLayout = (pdf: jsPDF): PdfLayout => {
  return {
    margin: 20,
    pageWidth: pdf.internal.pageSize.getWidth(),
    pageHeight: pdf.internal.pageSize.getHeight(),
    lineHeight: 7,
    contentWidth: pdf.internal.pageSize.getWidth() - 40, // 2x margins
    footerHeight: 20
  };
};

export const renderChapter1 = (pdf: jsPDF, layout: PdfLayout, data: PdfData): void => {
  console.log("=== RENDU CHAPITRE 1: DIRECTIVES ANTICIPÉES ===");
  
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
};

export const fetchAndRenderMedicalDocuments = async (pdf: jsPDF, layout: PdfLayout, userId?: string): Promise<void> => {
  console.log("=== RÉCUPÉRATION DOCUMENTS MÉDICAUX ===");
  console.log("UserId disponible:", userId);
  
  let medicalDocuments: any[] = [];
  
  if (userId) {
    console.log("Récupération des documents médicaux...");
    try {
      medicalDocuments = await getMedicalDocuments(userId);
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
};

export const addSignatureFooters = (pdf: jsPDF, layout: PdfLayout, signature: string | null): void => {
  const totalPages = pdf.getNumberOfPages();
  console.log("Ajout des pieds de page sur", totalPages, "page(s)");
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addSignatureFooter(pdf, layout, signature || null);
  }
};

export const validatePdfOutput = (pdfOutput: string): void => {
  if (!pdfOutput || typeof pdfOutput !== 'string' || pdfOutput.length < 100) {
    console.error("Erreur: PDF généré invalide", {
      hasOutput: !!pdfOutput,
      outputType: typeof pdfOutput,
      outputLength: pdfOutput?.length || 0
    });
    throw new Error("La génération du PDF a échoué, sortie invalide");
  }
  
  console.log("PDF généré avec succès, taille:", pdfOutput.length, "caractères");
};
