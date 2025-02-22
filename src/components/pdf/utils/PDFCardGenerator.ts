
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

    // Nom et Prénom
    const fullName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
    if (fullName) {
      doc.setFont("helvetica", "bold");
      doc.text("Nom et Prénom :", 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(fullName, 25, yPosition);
      yPosition += 4;
    }

    // Date de naissance
    if (profile.birth_date) {
      try {
        doc.setFont("helvetica", "bold");
        doc.text("Date de naissance :", 5, yPosition);
        doc.setFont("helvetica", "normal");
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.text(formattedDate, 25, yPosition);
        yPosition += 4;
      } catch (error) {
        console.error("[PDFCardGenerator] Error formatting birth date:", error);
      }
    }

    // Personne de confiance
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0];
      doc.setFont("helvetica", "bold");
      doc.text("Personne de confiance :", 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(person.name, 25, yPosition);
      yPosition += 4;
    }

    // Code d'accès et lien de connexion
    doc.setFont("helvetica", "bold");
    doc.text("Code d'accès :", 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(profile.unique_identifier || '', 25, yPosition);
    yPosition += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Site web :", 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 255);
    doc.text("directives-anticipees.lovable.dev", 25, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;

    // Emplacement du document
    doc.setFont("helvetica", "bold");
    doc.text("Document donné à :", 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text("...........................", 25, yPosition);
    yPosition += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Document rangé :", 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text("...........................", 25, yPosition);
    yPosition += 8;

    // Date et signature
    doc.text("Date : ..................  Signature : ..................", 5, yPosition);

    return doc.output('dataurlstring');
  }
}
