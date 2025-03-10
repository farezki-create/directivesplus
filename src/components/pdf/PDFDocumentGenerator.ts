
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { SignatureHandler } from "./utils/SignatureHandler";
import { PageManager } from "./utils/PageManager";
import { DocumentFooter } from "./utils/DocumentFooter";

export class PDFDocumentGenerator {
  static async generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with profile:", profile);
    console.log("[PDFGenerator] Profile name details:", {
      firstName: profile.first_name,
      lastName: profile.last_name
    });

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Define document margins
      const margin = {
        top: 20,
        bottom: 30,
        left: 20,
        right: 20
      };

      // Set initial document properties
      doc.setProperties({
        title: "Directives Anticipées",
        subject: "Directives Anticipées",
        author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
        keywords: "directives anticipées, santé",
        creator: "Application Directives Anticipées"
      });

      let yPosition = margin.top;

      // === PAGE 1 ===
      // Add document header
      const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
      yPosition = PageManager.addHeader(
        doc, 
        "Directives Anticipées", 
        `Document établi le ${dateStr}`, 
        yPosition
      );

      // Add user profile information
      if (profile) {
        yPosition = PDFUserSection.generate(doc, profile, yPosition);
      } else {
        console.warn("[PDFGenerator] No profile data available");
        doc.setFontSize(12);
        doc.text("Information d'identité non disponible", margin.left, yPosition);
        yPosition += 15;
      }

      // Add directives section if not a trusted person document
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

      // Add trusted person section
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

      // Add signature section
      yPosition += 30;
      yPosition = DocumentFooter.addSignatureSection(doc, profile, yPosition);

      // Apply signature to document if available
      await SignatureHandler.applySignature(doc, profile);

      // Add page numbers
      PageManager.addPageNumbers(doc);

      // Utiliser le format de sortie "blob" pour éviter les problèmes de sécurité
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      console.log("[PDFGenerator] Generated blob URL:", blobUrl);
      return blobUrl;
    } catch (error) {
      console.error("[PDFGenerator] Error generating PDF:", error);
      throw error;
    }
  }
}
