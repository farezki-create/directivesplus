
import { jsPDF } from "jspdf";
import { formatResponseText } from "../../free-text/ResponseFormatter";
import { PDFSynthesisSection } from "./PDFSynthesisSection";

export class PDFResponsesSection {
  static generate(doc: jsPDF, responses: any, startY: number): number {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Enhanced logging for debugging
    console.log("[PDFResponsesSection] Processing responses:", {
      general: responses.general?.length || 0,
      lifeSupport: responses.lifeSupport?.length || 0,
      advancedIllness: responses.advancedIllness?.length || 0,
      preferences: responses.preferences?.length || 0,
      hasSynthesis: !!responses.synthesis,
      synthesisType: responses.synthesis ? typeof responses.synthesis : 'none'
    });
    
    if (responses.synthesis) {
      console.log("[PDFResponsesSection] Synthesis content:", {
        isFreeTextPresent: !!responses.synthesis.free_text,
        freeTextLength: responses.synthesis.free_text?.length || 0,
        freeTextSample: responses.synthesis.free_text ? 
          responses.synthesis.free_text.substring(0, 30) + 
          (responses.synthesis.free_text.length > 30 ? '...' : '') : 
          'No text'
      });
    }
    
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

    // Add the synthesis section using the dedicated class
    console.log("[PDFResponsesSection] Synthesis data:", responses.synthesis ? "Present" : "Not present");
    if (responses.synthesis) {
      console.log("[PDFResponsesSection] Synthesis free_text:", 
        responses.synthesis.free_text ? 
          `Present (${responses.synthesis.free_text.length} chars)` : 
          "Not present");
    }
    
    yPosition = PDFSynthesisSection.generate(doc, responses, yPosition);

    return yPosition;
  }
}
