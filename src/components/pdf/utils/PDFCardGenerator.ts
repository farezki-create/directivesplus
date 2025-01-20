import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFCardGenerator {
  static generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Generating card-sized PDF");
    
    // Credit card dimensions in mm (standard size: 85.6 × 53.98 mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    
    const doc = new jsPDF({
      unit: 'mm',
      format: [cardHeight, cardWidth], // Swap dimensions for landscape
      orientation: 'landscape'
    });

    // Set small font size for compact layout
    doc.setFontSize(7);
    let yPosition = 5;

    // Full name
    const fullName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
    if (fullName) {
      doc.text(`${fullName}`, 5, yPosition);
      yPosition += 4;
    }

    // Birth date
    if (profile.birth_date) {
      try {
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.text(`Né(e) le : ${formattedDate}`, 5, yPosition);
        yPosition += 4;
      } catch (error) {
        console.error("[PDFCardGenerator] Error formatting birth date:", error);
      }
    }

    // Access code
    doc.text(`Code d'accès : ${profile.unique_identifier}`, 5, yPosition);
    yPosition += 4;

    // Connection link
    doc.setTextColor(0, 0, 255);
    doc.text("directives-anticipees.lovable.dev", 5, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 4;

    // Trusted person
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0];
      doc.text(`Personne de confiance : ${person.name}`, 5, yPosition);
      yPosition += 8;
    }

    // Date and signature
    doc.text("Date : ..................  Signature : ..................", 5, yPosition);

    return doc.output('dataurlstring');
  }
}