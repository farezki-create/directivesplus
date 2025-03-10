
import { jsPDF } from "jspdf";

export class PageManager {
  /**
   * Add page numbers to all pages in the document
   */
  static addPageNumbers(doc: jsPDF): void {
    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i}/${totalPages}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
  }

  /**
   * Add a document header with title and date
   */
  static addHeader(doc: jsPDF, title: string, subtitle: string, yPosition: number): number {
    // En-tête avec titre principal
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(
      title,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Sous-titre
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      subtitle,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    
    return yPosition + 20; // Return the new Y position
  }
}
