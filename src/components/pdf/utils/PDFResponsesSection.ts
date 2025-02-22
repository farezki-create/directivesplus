
import { jsPDF } from "jspdf";
import { formatResponseText } from "../../free-text/ResponseFormatter";

export class PDFResponsesSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const sectionTitleStyle = () => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
    };

    const questionStyle = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
    };

    const responseStyle = () => {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
    };

    const addSection = (title: string, items: any[]) => {
      if (items && items.length > 0) {
        sectionTitleStyle();
        doc.text(title, 20, yPosition);
        yPosition += 5;

        items.forEach((response: any) => {
          const questionText = response.question_text || 
                           response.questions?.Question || 
                           response.life_support_questions?.question ||
                           response.advanced_illness_questions?.question ||
                           response.preferences_questions?.question;

          questionStyle();
          const lines = doc.splitTextToSize(questionText, pageWidth - 40);
          doc.text(lines, 20, yPosition);
          yPosition += lines.length * 4;

          responseStyle();
          const formattedResponse = formatResponseText(response.response);
          const responseLines = doc.splitTextToSize(formattedResponse, pageWidth - 45);
          doc.text(responseLines, 25, yPosition);
          yPosition += responseLines.length * 3 + 2;
        });

        yPosition += 3;
      }
    };

    // Ajout des sections
    addSection("Mon avis d'une façon générale", responses.general || []);
    addSection("Maintien en vie", responses.lifeSupport || []);
    addSection("Maladie avancée", responses.advancedIllness || []);
    addSection("Mes goûts et mes peurs", responses.preferences || []);

    // Section texte libre
    if (responses.synthesis?.free_text) {
      sectionTitleStyle();
      doc.text("Texte libre", 20, yPosition);
      yPosition += 5;

      responseStyle();
      const lines = doc.splitTextToSize(responses.synthesis.free_text, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 3;
    }

    return yPosition;
  }
}
