
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
    
    // Titre de la section
    labelStyle();
    doc.text("Personne(s) de confiance", 20, yPosition);
    yPosition += 10;

    if (trustedPersons && trustedPersons.length > 0) {
      trustedPersons.forEach((person, index) => {
        // Nouvelle page si nécessaire
        if (yPosition > doc.internal.pageSize.getHeight() - 100) {
          doc.addPage();
          yPosition = 30;
        }

        // Si ce n'est pas la première personne, ajouter un séparateur
        if (index > 0) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition - 5, doc.internal.pageSize.getWidth() - 20, yPosition - 5);
          yPosition += 5;
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
        doc.text(person.phone || "Non renseigné", 60, yPosition);
        yPosition += 10;
        
        labelStyle();
        doc.text("Email :", 20, yPosition);
        valueStyle();
        doc.text(person.email || "Non renseigné", 60, yPosition);
        yPosition += 10;
        
        if (person.address) {
          labelStyle();
          doc.text("Adresse :", 20, yPosition);
          valueStyle();
          doc.text(person.address, 60, yPosition);
          yPosition += 10;
          
          if (person.postal_code || person.city) {
            const cityLine = `${person.postal_code || ""} ${person.city || ""}`.trim();
            doc.text(cityLine, 60, yPosition);
            yPosition += 10;
          }
        }

        yPosition += 5; // Espace après chaque personne
      });
    } else {
      valueStyle();
      doc.text("Aucune personne de confiance désignée", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}
