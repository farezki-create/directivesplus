
import { jsPDF } from "jspdf";
import { PdfLayout, QuestionResponse } from "./types";
import { checkPageBreak } from "./helpers";

export const formatQuestionnairesSection = (doc: jsPDF, questionnairesData: QuestionResponse[], startY: number): number => {
  let currentY = startY;
  
  if (!questionnairesData || questionnairesData.length === 0) {
    return currentY;
  }

  // Add section title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Mes réponses au questionnaire", 20, currentY);
  currentY += 10;

  // Reset to normal text
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Add each question and response
  questionnairesData.forEach((item) => {
    // Type assertion to address the error
    const questionItem = item as QuestionResponse;
    
    // Check available space
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add question
    doc.setFont("helvetica", "bold");
    doc.text(questionItem.question, 20, currentY);
    currentY += 8;
    
    // Add response
    doc.setFont("helvetica", "normal");
    const responseLines = doc.splitTextToSize(questionItem.response, 170);
    doc.text(responseLines, 20, currentY);
    currentY += responseLines.length * 7 + 5;
  });

  return currentY;
};

export const renderQuestionnaires = (
  pdf: jsPDF,
  layout: PdfLayout,
  yPosition: number,
  responses: Record<string, any>,
  translateResponse: (response: string) => string
): number => {
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("RÉPONSES AU QUESTIONNAIRE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  let currentY = yPosition;
  
  // Check if responses object is empty
  if (!responses || Object.keys(responses).length === 0) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Aucune réponse au questionnaire", 20, currentY);
    return currentY + layout.lineHeight * 2;
  }
  
  // Process each questionnaire section
  for (const [section, questions] of Object.entries(responses)) {
    let sectionTitle = "";
    
    switch(section) {
      case 'avis-general':
        sectionTitle = "Avis Général";
        break;
      case 'maintien-vie':
        sectionTitle = "Maintien en Vie";
        break;
      case 'maladie-avancee':
        sectionTitle = "Maladie Avancée";
        break;
      case 'gouts-peurs':
        sectionTitle = "Goûts et Peurs";
        break;
      default:
        sectionTitle = section;
    }
    
    // Add section title
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    currentY = checkPageBreak(pdf, layout, currentY, layout.lineHeight * 2);
    pdf.text(sectionTitle, 20, currentY);
    currentY += layout.lineHeight * 1.5;
    
    // Add questions and responses
    pdf.setFontSize(12);
    
    for (const [questionId, item] of Object.entries(questions as Record<string, {response: string, question: string}>)) {
      // Check if we need a new page
      currentY = checkPageBreak(pdf, layout, currentY, layout.lineHeight * 4);
      
      // Add question
      pdf.setFont("helvetica", "bold");
      const questionLines = pdf.splitTextToSize(item.question, layout.contentWidth);
      pdf.text(questionLines, 20, currentY);
      currentY += questionLines.length * layout.lineHeight;
      
      // Add response
      pdf.setFont("helvetica", "normal");
      const translatedResponse = translateResponse(item.response);
      pdf.text(`Réponse: ${translatedResponse}`, 30, currentY);
      currentY += layout.lineHeight * 1.5;
    }
    
    // Add spacing between sections
    currentY += layout.lineHeight;
  }
  
  return currentY;
};
