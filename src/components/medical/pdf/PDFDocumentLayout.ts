
import { jsPDF } from "jspdf";

/**
 * Utility class for managing PDF document layout and styling
 */
export class PDFDocumentLayout {
  /**
   * Adds a title to the PDF document
   * @param pdfDoc - The jsPDF document instance
   * @param title - The title text
   * @param y - The y position
   * @returns The new y position after adding the title
   */
  static addTitle(pdfDoc: jsPDF, title: string, y: number): number {
    pdfDoc.setFontSize(18);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text(title, 105, y, { align: "center" });
    return y + 10;
  }

  /**
   * Adds a section header to the PDF document
   * @param pdfDoc - The jsPDF document instance
   * @param title - The section title text
   * @param y - The y position
   * @returns The new y position after adding the section header
   */
  static addSectionHeader(pdfDoc: jsPDF, title: string, y: number): number {
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text(title, 20, y);
    pdfDoc.setFont("helvetica", "normal");
    return y + 10;
  }

  /**
   * Checks if a new page is needed and adds it if necessary
   * @param pdfDoc - The jsPDF document instance
   * @param y - The current y position
   * @param threshold - The threshold value (default: 250)
   * @returns The new y position after potentially adding a new page
   */
  static checkForNewPage(pdfDoc: jsPDF, y: number, threshold: number = 250): number {
    if (y > threshold) {
      pdfDoc.addPage();
      return 20;
    }
    return y;
  }

  /**
   * Adds a text field to the PDF document
   * @param pdfDoc - The jsPDF document instance
   * @param label - The field label
   * @param value - The field value
   * @param y - The y position
   * @returns The new y position after adding the field
   */
  static addField(pdfDoc: jsPDF, label: string, value: string, y: number): number {
    pdfDoc.text(`${label}: ${value}`, 25, y);
    return y + 8;
  }
}
