import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFDateSection {
  static generate(doc: jsPDF, yPosition: number): number {
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.setFontSize(12);
    doc.text(`Fait le ${currentDate}`, 20, yPosition);
    yPosition += 20;
    doc.text("À : _____________________", 20, yPosition);
    yPosition += 20;
    
    return yPosition;
  }
}