
import { jsPDF } from "jspdf";
import { formatText, addFormattedText } from "./pdfFormatters";

// Interface for PDF layout configuration
export interface PdfLayout {
  margin: number;
  contentWidth: number;
  lineHeight: number;
  pageWidth: number;
  pageHeight: number;
  footerHeight: number;
}

// Render the header section of the PDF
export const renderHeader = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number
): number => {
  const { pageWidth } = layout;
  
  // Title
  let currentY = addFormattedText(
    pdf, 
    "DIRECTIVES ANTICIPÉES", 
    pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 20, 
      align: "center" 
    }
  );
  
  currentY += layout.lineHeight * 2;
  
  // Date
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  currentY = addFormattedText(
    pdf, 
    `Document généré le ${dateStr}`, 
    pageWidth / 2, 
    currentY, 
    { 
      fontSize: 11, 
      align: "center" 
    }
  );
  
  return currentY + layout.lineHeight * 2;
};

// Render personal information section
export const renderPersonalInfo = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  profileData: any
): number => {
  const { margin, contentWidth, lineHeight } = layout;
  
  // Section title
  let currentY = addFormattedText(
    pdf, 
    "Informations Personnelles", 
    layout.pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 16, 
      align: "center" 
    }
  );
  
  currentY += lineHeight * 1.5;
  
  // Reset text format
  formatText(pdf);
  
  if (profileData) {
    const { first_name, last_name, birth_date, address } = profileData;
    const birthDateFormatted = birth_date 
      ? new Date(birth_date).toLocaleDateString('fr-FR') 
      : 'Non spécifié';
    
    // Add profile information
    const texts = [
      `Nom: ${last_name || 'Non spécifié'}`,
      `Prénom: ${first_name || 'Non spécifié'}`,
      `Date de naissance: ${birthDateFormatted}`
    ];
    
    if (address) {
      texts.push(`Adresse: ${address}`);
    }
    
    // Render each line of text
    for (const text of texts) {
      const splitText = pdf.splitTextToSize(text, contentWidth);
      pdf.text(splitText, margin, currentY);
      currentY += splitText.length * lineHeight;
    }
  } else {
    const text = "Aucune information personnelle disponible";
    const splitText = pdf.splitTextToSize(text, contentWidth);
    pdf.text(splitText, margin, currentY);
    currentY += splitText.length * lineHeight;
  }
  
  return currentY + lineHeight;
};

// Render trusted persons section
export const renderTrustedPersons = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  trustedPersons: any[]
): number => {
  const { margin, contentWidth, lineHeight } = layout;
  
  // Section title
  let currentY = addFormattedText(
    pdf, 
    "Personnes de Confiance", 
    layout.pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 16, 
      align: "center" 
    }
  );
  
  currentY += lineHeight * 1.5;
  
  // Reset text format
  formatText(pdf);
  
  if (trustedPersons && trustedPersons.length > 0) {
    for (let i = 0; i < trustedPersons.length; i++) {
      const person = trustedPersons[i];
      
      // Add subtitle for each trusted person
      formatText(pdf, { fontStyle: "bold", fontSize: 12, color: [70, 70, 70] });
      pdf.text(`Personne de confiance ${i + 1}`, margin, currentY);
      currentY += lineHeight;
      
      // Reset text format
      formatText(pdf);
      
      // Add person details
      const details = [
        `Nom: ${person.last_name || 'Non spécifié'}`,
        `Prénom: ${person.first_name || 'Non spécifié'}`,
        `Relation: ${person.relationship || 'Non spécifiée'}`,
        `Téléphone: ${person.phone || 'Non spécifié'}`,
        `Email: ${person.email || 'Non spécifié'}`
      ];
      
      for (const detail of details) {
        const splitText = pdf.splitTextToSize(detail, contentWidth);
        pdf.text(splitText, margin, currentY);
        currentY += splitText.length * lineHeight;
      }
      
      currentY += lineHeight;
    }
  } else {
    const text = "Aucune personne de confiance désignée";
    const splitText = pdf.splitTextToSize(text, contentWidth);
    pdf.text(splitText, margin, currentY);
    currentY += splitText.length * lineHeight;
  }
  
  return currentY + lineHeight;
};

// Render questionnaire responses section
export const renderQuestionnaires = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  responses: Record<string, any>,
  translateResponse: (response: string) => string
): number => {
  const { margin, contentWidth, lineHeight } = layout;
  
  // Section title
  let currentY = addFormattedText(
    pdf, 
    "Mes Souhaits et Préférences", 
    layout.pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 16, 
      align: "center" 
    }
  );
  
  currentY += lineHeight * 1.5;
  
  // Reset text format
  formatText(pdf);
  
  if (responses && Object.keys(responses).length > 0) {
    for (const [questionnaireType, questions] of Object.entries(responses)) {
      // Get the section title based on the questionnaire type
      let title = questionnaireType;
      switch (questionnaireType) {
        case 'avis-general':
          title = "Avis Général";
          break;
        case 'maintien-vie':
          title = "Maintien en Vie";
          break;
        case 'maladie-avancee':
          title = "Maladie Avancée";
          break;
        case 'gouts-peurs':
          title = "Goûts et Peurs";
          break;
      }
      
      // Add subtitle for the questionnaire type
      formatText(pdf, { fontStyle: "bold", fontSize: 12, color: [70, 70, 70] });
      pdf.text(title, margin, currentY);
      currentY += lineHeight;
      
      // Reset text format
      formatText(pdf);
      
      // Add each question and response
      for (const [_, questionData] of Object.entries(questions)) {
        const question = questionData.question || "Question non définie";
        const response = translateResponse(questionData.response || "Pas de réponse");
        
        // Format and add the question
        formatText(pdf, { fontStyle: "bold" });
        const questionSplit = pdf.splitTextToSize(question, contentWidth);
        pdf.text(questionSplit, margin, currentY);
        currentY += questionSplit.length * lineHeight;
        
        // Format and add the response
        formatText(pdf);
        const responseSplit = pdf.splitTextToSize(`Réponse: ${response}`, contentWidth);
        pdf.text(responseSplit, margin, currentY);
        currentY += responseSplit.length * lineHeight;
        
        currentY += lineHeight / 2;
      }
      
      currentY += lineHeight;
    }
  } else {
    const text = "Aucune réponse au questionnaire";
    const splitText = pdf.splitTextToSize(text, contentWidth);
    pdf.text(splitText, margin, currentY);
    currentY += splitText.length * lineHeight;
  }
  
  return currentY + lineHeight;
};

// Render phrases sections (examples and custom)
export const renderPhrases = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  phrases: string[],
  title: string
): number => {
  const { margin, contentWidth, lineHeight } = layout;
  
  if (!phrases || phrases.length === 0) {
    return yPosition;
  }
  
  // Section title
  let currentY = addFormattedText(
    pdf, 
    title, 
    layout.pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 16, 
      align: "center" 
    }
  );
  
  currentY += lineHeight * 1.5;
  
  // Reset text format
  formatText(pdf);
  
  // Add each phrase
  for (const phrase of phrases) {
    const text = `• ${phrase}`;
    const splitText = pdf.splitTextToSize(text, contentWidth);
    pdf.text(splitText, margin, currentY);
    currentY += splitText.length * lineHeight;
  }
  
  return currentY + lineHeight;
};

// Render free text section
export const renderFreeText = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  freeText: string
): number => {
  const { margin, contentWidth, lineHeight } = layout;
  
  if (!freeText) {
    return yPosition;
  }
  
  // Section title
  let currentY = addFormattedText(
    pdf, 
    "Expression libre", 
    layout.pageWidth / 2, 
    yPosition, 
    { 
      color: [41, 82, 155], 
      fontStyle: "bold", 
      fontSize: 16, 
      align: "center" 
    }
  );
  
  currentY += lineHeight * 1.5;
  
  // Reset text format
  formatText(pdf);
  
  // Add free text
  const splitText = pdf.splitTextToSize(freeText, contentWidth);
  pdf.text(splitText, margin, currentY);
  currentY += splitText.length * lineHeight;
  
  return currentY + lineHeight;
};

// Render signature section
export const renderSignature = (
  pdf: jsPDF, 
  layout: PdfLayout,
  yPosition: number,
  signature: string
): number => {
  const { margin, lineHeight } = layout;
  
  if (!signature) {
    return yPosition;
  }
  
  try {
    // Add signature as image
    const imgWidth = 50;
    pdf.addImage(signature, 'PNG', margin, yPosition, imgWidth, 20);
    return yPosition + 20 + lineHeight;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la signature:", error);
    
    // If signature fails, add text instead
    formatText(pdf);
    pdf.text("Signature non disponible", margin, yPosition);
    return yPosition + lineHeight;
  }
};

// Add signature to the bottom of page
export const addSignatureFooter = (
  pdf: jsPDF,
  layout: PdfLayout,
  signature: string
): void => {
  if (!signature) return;
  
  try {
    const { margin, pageHeight, footerHeight, pageWidth } = layout;
    
    // Position at the bottom of the page minus footer height
    const footerY = pageHeight - footerHeight;
    
    // Add a horizontal line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    // Add signature text
    formatText(pdf, { fontStyle: "italic", fontSize: 8, color: [100, 100, 100] });
    pdf.text("Document signé électroniquement", margin, footerY);
    
    // Add signature as small image
    const imgWidth = 20;
    const imgHeight = 10;
    pdf.addImage(signature, 'PNG', pageWidth - margin - imgWidth, footerY - imgHeight, imgWidth, imgHeight);
  } catch (error) {
    console.error("Erreur lors de l'ajout du pied de page:", error);
  }
};
