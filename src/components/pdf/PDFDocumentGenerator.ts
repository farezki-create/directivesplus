
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with profile:", profile);
    const doc = new jsPDF();
    let yPosition = 20;

    // Add logo
    // Note: you'll need to add your logo image here
    // doc.addImage("logo.png", "PNG", 20, 10, 50, 20);
    
    // Title
    doc.setFontSize(20);
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 25;

    // Utilisation du profil pour l'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // For trusted person document, skip directives anticipées section
    if (responses?.type !== "trusted_person") {
      yPosition += 25;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);

      // Add new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // Section for Trusted Person
    yPosition += 25;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Personne de confiance", 20, yPosition);
    doc.setFont(undefined, 'normal');
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Final Section: Signature
    yPosition += 25;
    doc.setFontSize(12);
    
    // Je soussigné(e) section avec le nom prérempli
    doc.text("Je soussigné(e)", 20, yPosition);
    yPosition += 10;
    
    // Name line with pre-filled name if available
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(`Nom et prénoms : ${fullName}`, 20, yPosition);
    yPosition += 15;
    
    // Date and place line spanning the width
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${today} à ${profile?.city || '................................'}`, 20, yPosition);
    yPosition += 20;
    
    // Signature
    doc.setFontSize(12);
    doc.text("Signature :", 20, yPosition);

    return doc.output('dataurlstring');
  }
}
