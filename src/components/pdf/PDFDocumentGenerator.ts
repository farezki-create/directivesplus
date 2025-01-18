import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text("Directives Anticipées", pageWidth / 2, yPosition, { align: "center" });
    
    // User information
    yPosition += 20;
    doc.setFontSize(12);
    if (profile) {
      doc.text(`${profile.first_name} ${profile.last_name}`, 20, yPosition);
      yPosition += 10;
      if (profile.address) {
        doc.text(profile.address, 20, yPosition);
        yPosition += 7;
      }
      if (profile.postal_code || profile.city) {
        doc.text(`${profile.postal_code || ""} ${profile.city || ""}`, 20, yPosition);
        yPosition += 7;
      }
      if (profile.phone_number) {
        doc.text(`Tél: ${profile.phone_number}`, 20, yPosition);
        yPosition += 7;
      }
    }

    // Access code
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Code d'accès pour les professionnels de santé:", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    if (profile?.unique_identifier) {
      doc.text(profile.unique_identifier, 20, yPosition);
    }

    // Synthesis
    yPosition += 20;
    doc.setFontSize(14);
    doc.text("Synthèse du questionnaire:", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    if (responses?.free_text) {
      const lines = doc.splitTextToSize(responses.free_text, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 7;
    }

    // Free text space
    yPosition += 20;
    doc.setFontSize(14);
    doc.text("Notes complémentaires:", 20, yPosition);
    yPosition += 10;
    for (let i = 0; i < 3; i++) {
      doc.line(20, yPosition + (i * 10), pageWidth - 20, yPosition + (i * 10));
    }

    // Trusted persons
    yPosition += 40;
    doc.setFontSize(14);
    doc.text("Personne(s) de confiance:", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    trustedPersons.forEach((person, index) => {
      doc.text(`${index + 1}. ${person.name}`, 20, yPosition);
      yPosition += 7;
      doc.text(`   Tél: ${person.phone}`, 20, yPosition);
      yPosition += 7;
      doc.text(`   Email: ${person.email}`, 20, yPosition);
      yPosition += 7;
      doc.text(`   Relation: ${person.relation}`, 20, yPosition);
      yPosition += 10;
    });

    // Date and signature
    yPosition += 20;
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${currentDate} à `, 20, yPosition);
    yPosition += 20;
    doc.text("Signature:", 20, yPosition);

    return doc.output('dataurlstring');
  }
}