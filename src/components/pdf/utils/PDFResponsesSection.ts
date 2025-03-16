
import { jsPDF } from "jspdf";
import { formatResponseText } from "../../free-text/ResponseFormatter";

export class PDFResponsesSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Styles
    const sectionTitleStyle = () => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
    };

    const questionStyle = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
    };

    const responseStyle = () => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    };

    const addSection = (title: string, items: any[]) => {
      if (items && items.length > 0) {
        // Nouvelle page si nécessaire
        if (yPosition > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPosition = 30;
        }

        sectionTitleStyle();
        doc.text(title, 20, yPosition);
        yPosition += 10;

        items.forEach((response: any) => {
          // Nouvelle page si nécessaire
          if (yPosition > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            yPosition = 30;
          }

          const questionText = response.question_text || 
                             response.questions?.Question || 
                             response.life_support_questions?.question ||
                             response.advanced_illness_questions?.question ||
                             response.preferences_questions?.question;

          questionStyle();
          const lines = doc.splitTextToSize(questionText, pageWidth - 40);
          doc.text(lines, 20, yPosition);
          yPosition += lines.length * 7;

          responseStyle();
          const formattedResponse = formatResponseText(response.response);
          const responseLines = doc.splitTextToSize(formattedResponse, pageWidth - 45);
          doc.text(responseLines, 25, yPosition);
          yPosition += responseLines.length * 6 + 5;
        });

        yPosition += 10;
      }
    };

    // Ajout des sections
    addSection("Mon avis d'une façon générale", responses.general || []);
    addSection("Maintien en vie", responses.lifeSupport || []);
    addSection("Maladie avancée", responses.advancedIllness || []);
    addSection("Mes goûts et mes peurs", responses.preferences || []);

    return yPosition;
  }
}
