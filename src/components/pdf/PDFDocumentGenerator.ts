
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
    // Créer le document PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Définir les marges
    const margin = {
      top: 30,
      bottom: 30,
      left: 25,
      right: 25
    };

    // Configuration initiale du document
    doc.setProperties({
      title: "Directives Anticipées",
      subject: "Directives Anticipées",
      author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
      keywords: "directives anticipées, santé",
      creator: "Application Directives Anticipées"
    });

    let yPosition = margin.top;

    // === PAGE 1 ===
    // En-tête avec titre principal
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 25;

    // Sous-titre avec la date
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Document établi le ${dateStr}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 30;

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 20;
    }

    // Section des directives
    if (responses?.type !== "trusted_person") {
      yPosition += 25;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Mes directives anticipées", margin.left, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 15;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    }

    // === PAGE 2 ===
    doc.addPage();
    yPosition = margin.top;

    // Section Personne de confiance
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Personne de confiance",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    doc.setFont("helvetica", "normal");
    yPosition += 20;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Section signature avec espacement augmenté
    yPosition += 40;
    doc.setFontSize(14);
    
    // Section "Je soussigné(e)" centrée
    doc.text(
      "Je soussigné(e)",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;
    
    // Nom complet centré
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(
      fullName,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;
    
    // Date et lieu centrés
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Fait le ${today} à ${profile?.city || '................................'}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 25;
    
    // Zone de signature centrée et plus grande
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    const signatureWidth = 100;
    const signatureX = (doc.internal.pageSize.getWidth() - signatureWidth) / 2;
    doc.rect(signatureX, yPosition, signatureWidth, 50, 'D');
    doc.text("Signature :", signatureX, yPosition - 5);

    // Numérotation des pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i}/${totalPages}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    return doc.output('dataurlstring');
  }
}
