import { jsPDF } from "jspdf";
import { TrustedPerson } from "../types";

export class PDFTrustedPersonSection {
  static generate(doc: jsPDF, trustedPersons: TrustedPerson[], yPosition: number): number {
    if (trustedPersons && trustedPersons.length > 0) {
      yPosition += 20;
      doc.setFontSize(14);
      doc.text("Personne de confiance:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      
      const person = trustedPersons[0]; // We only show the first person
      doc.text(`Nom: ${person.name}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Téléphone: ${person.phone}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Email: ${person.email}`, 20, yPosition);
      yPosition += 7;
      if (person.relation) {
        doc.text(`Relation: ${person.relation}`, 20, yPosition);
        yPosition += 7;
      }
      doc.text(`Adresse: ${person.address}`, 20, yPosition);
      yPosition += 7;
      doc.text(`${person.postal_code} ${person.city}`, 20, yPosition);
      yPosition += 15;
    }
    return yPosition;
  }
}