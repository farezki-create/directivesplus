
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
    // Créer le document avec des marges plus grandes
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      margins: {
        top: 30,
        bottom: 30,
        left: 20,
        right: 20
      }
    });

    // Configuration initiale du document
    doc.setProperties({
      title: "Directives Anticipées",
      subject: "Directives Anticipées",
      author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
      keywords: "directives anticipées, santé",
      creator: "Application Directives Anticipées"
    });

    let yPosition = 30;

    // En-tête avec titre principal
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 30;

    // Sous-titre avec la date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Document établi le ${dateStr}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    // Nouvelle page pour les directives
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 30;
    }

    // Section des directives
    if (responses?.type !== "trusted_person") {
      yPosition += 20;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);

      // Nouvelle page si nécessaire
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 30;
      }
    }

    // Section Personne de confiance
    yPosition += 20;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Personne de confiance", 20, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Nouvelle page si nécessaire pour la signature
    if (yPosition > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage();
      yPosition = 30;
    }

    // Section signature
    yPosition += 30;
    doc.setFontSize(12);
    
    // Section "Je soussigné(e)"
    doc.text("Je soussigné(e)", 20, yPosition);
    yPosition += 10;
    
    // Nom complet
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(`Nom et prénoms : ${fullName}`, 20, yPosition);
    yPosition += 20;
    
    // Date et lieu
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${today} à ${profile?.city || '................................'}`, 20, yPosition);
    yPosition += 25;
    
    // Zone de signature
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition, 80, 40, 'D');
    doc.text("Signature :", 20, yPosition - 5);

    return doc.output('dataurlstring');
  }
}
