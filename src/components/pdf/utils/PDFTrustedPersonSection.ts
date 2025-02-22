
import { jsPDF } from "jspdf";
import { TrustedPerson } from "../types";

export class PDFTrustedPersonSection {
  static generate(doc: jsPDF, trustedPersons: TrustedPerson[], startY: number): number {
    let yPosition = startY;
    
    const labelStyle = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
    };

    const valueStyle = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
    };
    
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0];

      // Informations sur une ligne quand possible
      labelStyle();
      doc.text("Nom :", 20, yPosition);
      valueStyle();
      doc.text(person.name, 60, yPosition);
      yPosition += 5;
      
      if (person.relation) {
        labelStyle();
        doc.text("Relation :", 20, yPosition);
        valueStyle();
        doc.text(person.relation, 60, yPosition);
        yPosition += 5;
      }

      // Contact sur une ligne
      labelStyle();
      doc.text("Contact :", 20, yPosition);
      valueStyle();
      doc.text(`${person.phone} - ${person.email}`, 60, yPosition);
      yPosition += 5;
      
      // Adresse complète
      labelStyle();
      doc.text("Adresse :", 20, yPosition);
      valueStyle();
      doc.text(person.address, 60, yPosition);
      yPosition += 5;
      doc.text(`${person.postal_code} ${person.city}`, 60, yPosition);
      yPosition += 5;
    } else {
      valueStyle();
      doc.text("Aucune personne de confiance désignée", 20, yPosition);
      yPosition += 5;
    }

    return yPosition;
  }
}
