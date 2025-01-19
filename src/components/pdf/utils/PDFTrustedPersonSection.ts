import { jsPDF } from "jspdf";
import { TrustedPerson } from "../types";

export class PDFTrustedPersonSection {
  static generate(doc: jsPDF, trustedPersons: TrustedPerson[], startY: number): number {
    let yPosition = startY;
    doc.setFontSize(12);
    
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0]; // We only show the first person

      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(`Nom : ${person.name}`, 20, yPosition);
      yPosition += 7;
      
      if (person.relation) {
        doc.text(`Relation : ${person.relation}`, 20, yPosition);
        yPosition += 7;
      }

      doc.text(`Téléphone : ${person.phone}`, 20, yPosition);
      yPosition += 7;
      
      doc.text(`Email : ${person.email}`, 20, yPosition);
      yPosition += 7;
      
      doc.text(`Adresse : ${person.address}`, 20, yPosition);
      yPosition += 7;
      
      doc.text(`${person.postal_code} ${person.city}`, 20, yPosition);
      yPosition += 7;
    } else {
      doc.text("Aucune personne de confiance désignée", 20, yPosition);
      yPosition += 7;
    }

    return yPosition;
  }
}