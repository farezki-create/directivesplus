
import { jsPDF } from "jspdf";
import { TrustedPerson } from "../types";

export class PDFTrustedPersonSection {
  static generate(doc: jsPDF, trustedPersons: TrustedPerson[], startY: number): number {
    let yPosition = startY;
    
    // Styles
    const labelStyle = () => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
    };

    const valueStyle = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
    };
    
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0]; // We only show the first person

      // Nouvelle page si nécessaire
      if (yPosition > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        yPosition = 30;
      }

      // Informations de la personne de confiance
      labelStyle();
      doc.text("Nom :", 20, yPosition);
      valueStyle();
      doc.text(person.name, 60, yPosition);
      yPosition += 10;
      
      if (person.relation) {
        labelStyle();
        doc.text("Relation :", 20, yPosition);
        valueStyle();
        doc.text(person.relation, 60, yPosition);
        yPosition += 10;
      }

      labelStyle();
      doc.text("Téléphone :", 20, yPosition);
      valueStyle();
      doc.text(person.phone, 60, yPosition);
      yPosition += 10;
      
      labelStyle();
      doc.text("Email :", 20, yPosition);
      valueStyle();
      doc.text(person.email, 60, yPosition);
      yPosition += 10;
      
      labelStyle();
      doc.text("Adresse :", 20, yPosition);
      valueStyle();
      doc.text(person.address, 60, yPosition);
      yPosition += 10;
      
      const cityLine = `${person.postal_code} ${person.city}`;
      doc.text(cityLine, 60, yPosition);
      yPosition += 10;
    } else {
      valueStyle();
      doc.text("Aucune personne de confiance désignée", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}
