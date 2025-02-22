
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
      top: 30,
      bottom: 30,
      left: 25,
      right: 25
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
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Directives Anticipées", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 25;

    // Date du document
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Document établi le ${dateStr}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 30;

    // Informations d'identité avec plus d'espacement
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
      yPosition += 25; // Plus d'espace après la section d'identité
    } else {
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 20;
    }

    // Section des directives sur la première page avec plus d'espacement
    if (responses?.type !== "trusted_person") {
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

    // Section Personne de confiance avec plus d'espacement
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Personne de confiance", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    doc.setFont("helvetica", "normal");
    yPosition += 20;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    yPosition += 40; // Plus d'espace avant la section signature
    
    // Section signature avec plus d'espacement
    doc.setFontSize(14);
    
    // Section "Je soussigné(e)" centrée
    doc.text("Je soussigné(e)", doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 15;
    
    // Nom complet centré
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(`${fullName}`, doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 20;
    
    // Date et lieu centrés
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${today} à ${profile?.city || '................................'}`, 
             doc.internal.pageSize.getWidth() / 2, yPosition, { align: "center" });
    yPosition += 25;
    
    // Zone de signature centrée
    doc.setDrawColor(0);
    doc.setFillColor(255, 255, 255);
    const signatureWidth = 100;
    const signatureX = (doc.internal.pageSize.getWidth() - signatureWidth) / 2;
    doc.rect(signatureX, yPosition, signatureWidth, 50, 'D');
    doc.text("Signature :", signatureX, yPosition - 5);

    // Numérotation des pages plus discrète
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i}/${totalPages}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, {
        align: "center"
      });
    }

    return doc.output('dataurlstring');
  }
}
