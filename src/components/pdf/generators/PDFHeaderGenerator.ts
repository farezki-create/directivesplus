
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFHeaderGenerator {
  static async generate(doc: jsPDF, startY: number): Promise<number> {
    let yPosition = startY;
    
    // En-tête avec titre principal
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Sous-titre avec la date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Document établi le ${dateStr}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;
    
    return yPosition;
  }
}
