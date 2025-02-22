
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
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Marges réduites
    const margin = {
      top: 15,
      bottom: 15,
      left: 15,
      right: 15
    };

    doc.setProperties({
      title: "Directives Anticipées",
      subject: "Directives Anticipées",
      author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
      keywords: "directives anticipées, santé",
      creator: "Application Directives Anticipées"
    });

    let yPosition = margin.top;

    // En-tête avec titre principal (taille réduite)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Directives Anticipées", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Sous-titre avec la date (taille réduite)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Document établi le ${dateStr}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(10);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 5;
    }

    yPosition += 5;

    // Section des directives
    if (responses?.type !== "trusted_person") {
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    }

    yPosition += 5;

    // Section Personne de confiance
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Personne de confiance", margin.left, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 5;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    yPosition += 10;
    
    // Section signature
    doc.setFontSize(10);
    
    // Section "Je soussigné(e)"
    doc.text("Je soussigné(e)", margin.left, yPosition);
    yPosition += 5;
    
    // Nom complet
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(`Nom et prénoms : ${fullName}`, margin.left, yPosition);
    yPosition += 10;
    
    // Date et lieu
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${today} à ${profile?.city || '................................'}`, margin.left, yPosition);
    yPosition += 10;
    
    // Zone de signature plus petite
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin.left, yPosition, 60, 30, 'D');
    doc.text("Signature :", margin.left, yPosition - 3);

    return doc.output('dataurlstring');
  }
}
