import { jsPDF } from "jspdf";

export class PDFResponsesSection {
  static generate(doc: jsPDF, responses: any, yPosition: number): number {
    const pageWidth = doc.internal.pageSize.getWidth();

    // General Responses
    if (responses?.general && responses.general.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Mon avis d'une façon générale:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.general.forEach((response: any) => {
        const text = `${response.question_text || response.questions?.Question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Life Support Responses
    if (responses?.lifeSupport && responses.lifeSupport.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Maintien en vie:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.lifeSupport.forEach((response: any) => {
        const text = `${response.question_text || response.life_support_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Advanced Illness Responses
    if (responses?.advancedIllness && responses.advancedIllness.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Maladie avancée:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.advancedIllness.forEach((response: any) => {
        const text = `${response.question_text || response.advanced_illness_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Preferences Responses
    if (responses?.preferences && responses.preferences.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Mes goûts et mes peurs:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.preferences.forEach((response: any) => {
        const text = `${response.question_text || response.preferences_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    return yPosition;
  }
}