
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Responsible for generating the PDF document header section
 */
export class PDFHeaderGenerator {
  /**
   * Generates the header section of the PDF document
   * @param doc - The jsPDF document instance
   * @param startY - The starting Y position for the header
   * @returns The new Y position after adding the header
   */
  static generate(doc: jsPDF, startY: number): number {
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
