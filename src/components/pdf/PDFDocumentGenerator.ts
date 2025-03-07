
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { PDFHeaderGenerator } from "./generators/PDFHeaderGenerator";
import { PDFFooterGenerator } from "./generators/PDFFooterGenerator";
import { PDFSignatureGenerator } from "./generators/PDFSignatureGenerator";

export class PDFDocumentGenerator {
  static async generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with profile:", profile);
    console.log("[PDFGenerator] Profile name details:", {
      firstName: profile.first_name,
      lastName: profile.last_name
    });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Définir les marges
    const margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
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
    // En-tête avec titre principal et sous-titre
    yPosition = await PDFHeaderGenerator.generate(doc, yPosition);

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 15;
    }

    // Section des directives
    if (responses?.type !== "trusted_person") {
      yPosition += 15;
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
    doc.text(
      "Personne de confiance",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    doc.setFont("helvetica", "normal");
    yPosition += 15;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Section signature et date
    yPosition = await PDFSignatureGenerator.generateSignatureSection(doc, profile, yPosition);

    // Ajouter les numéros de page et la signature à chaque page
    await PDFFooterGenerator.generate(doc, profile);

    return doc.output('dataurlstring');
  }
}
