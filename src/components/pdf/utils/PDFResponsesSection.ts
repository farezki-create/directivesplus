import { jsPDF } from "jspdf";

export class PDFResponsesSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(12);

    const addSection = (title: string, items: any[]) => {
      if (items && items.length > 0) {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text(title, 20, yPosition);
        yPosition += 7;

        items.forEach((response: any) => {
          // Check if we need a new page before each response
          if (yPosition > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            yPosition = 20;
          }

          const questionText = response.question_text || 
                             response.questions?.Question || 
                             response.life_support_questions?.question ||
                             response.advanced_illness_questions?.question ||
                             response.preferences_questions?.question;

          const text = `${questionText} : ${response.response}`;
          const lines = doc.splitTextToSize(text, pageWidth - 40);
          doc.text(lines, 20, yPosition);
          yPosition += lines.length * 7;
        });

        yPosition += 7;
      }
    };

    // Add each section
    addSection("Mon avis d'une façon générale", responses.general || []);
    addSection("Maintien en vie", responses.lifeSupport || []);
    addSection("Maladie avancée", responses.advancedIllness || []);
    addSection("Mes goûts et mes peurs", responses.preferences || []);

    // Add free text section if it exists
    if (responses.synthesis?.free_text) {
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text("Texte libre", 20, yPosition);
      yPosition += 7;

      const lines = doc.splitTextToSize(responses.synthesis.free_text, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 7;
    }

    return yPosition;
  }
}