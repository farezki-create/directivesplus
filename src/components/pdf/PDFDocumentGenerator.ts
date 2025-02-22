
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

    // Marges standards pour une meilleure lisibilité
    const margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };

    doc.setProperties({
      title: "Directives Anticipées",
      subject: "Directives Anticipées",
      author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
      keywords: "directives anticipées, santé",
      creator: "Application Directives Anticipées"
    });

    // === PAGE 1 ===
    let yPosition = margin.top;

    // En-tête Page 1
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Directives Anticipées", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Date du document
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Document établi le ${dateStr}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 10;
    }

    yPosition += 15;

    // Section des directives sur la première page
    if (responses?.type !== "trusted_person") {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Mes directives anticipées", margin.left, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    }

    // === PAGE 2 ===
    doc.addPage();
    yPosition = margin.top;

    // Section Personne de confiance
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Personne de confiance", margin.left, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    yPosition += 20;
    
    // Section signature
    doc.setFontSize(12);
    
    // Section "Je soussigné(e)"
    doc.text("Je soussigné(e)", margin.left, yPosition);
    yPosition += 10;
    
    // Nom complet
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(`Nom et prénoms : ${fullName}`, margin.left, yPosition);
    yPosition += 15;
    
    // Date et lieu
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${today} à ${profile?.city || '................................'}`, margin.left, yPosition);
    yPosition += 20;
    
    // Zone de signature
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin.left, yPosition, 80, 40, 'D');
    doc.text("Signature :", margin.left, yPosition - 5);

    // Numérotation des pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i}/${totalPages}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
        align: "center"
      });
    }

    return doc.output('dataurlstring');
  }
}
