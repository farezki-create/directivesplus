
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
