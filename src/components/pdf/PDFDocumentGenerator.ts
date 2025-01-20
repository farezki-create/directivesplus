import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[], signatureData: string | null = null) {
    console.log("[PDFGenerator] Generating PDF with responses:", responses);
    const doc = new jsPDF();
    let yPosition = 20;

    // Check if this is a trusted person document
    const isTrustedPersonDoc = responses?.type === "trusted_person";

    // Title
    doc.setFontSize(20);
    doc.text(
      isTrustedPersonDoc ? "Désignation de la personne de confiance" : "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Section 1: User Identity
    doc.setFontSize(16);
    doc.text("1. Mon identité", 20, yPosition);
    yPosition += 10;
    yPosition = PDFUserSection.generate(doc, profile, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Section 2: Access Code
    yPosition += 20;
    doc.setFontSize(16);
    doc.text("2. Code d'accès au document", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Code d'accès : ${profile.unique_identifier}`, 20, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // For trusted person document, skip directives anticipées section
    if (!isTrustedPersonDoc) {
      // Section 3: Directives Anticipées Synthesis
      yPosition += 20;
      doc.setFontSize(16);
      doc.text("3. Synthèse de mes directives anticipées", 20, yPosition);
      yPosition += 10;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);

      // Add new page if needed
      if (yPosition > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // Section for Trusted Person
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      isTrustedPersonDoc ? "3. Personne de confiance" : "4. Personne de confiance",
      20,
      yPosition
    );
    yPosition += 10;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Final Section: Date, Place and Signature
    yPosition += 20;
    doc.setFontSize(16);
    doc.text(
      isTrustedPersonDoc ? "4. Date, lieu et signature" : "5. Date, lieu et signature",
      20,
      yPosition
    );
    yPosition += 10;
    
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.setFontSize(12);
    doc.text(`Fait le ${currentDate}`, 20, yPosition);
    yPosition += 10;
    doc.text("À : _____________________", 20, yPosition);
    yPosition += 20;

    // Add signature if provided
    if (signatureData) {
      try {
        // Create a temporary image to get dimensions
        const img = new Image();
        img.src = signatureData;
        
        // Set maximum dimensions for the signature
        const maxWidth = 80;  // Reduced from 100
        const maxHeight = 40; // Reduced from 50
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Calculate dimensions while maintaining aspect ratio
        let width = maxWidth;
        let height = width / aspectRatio;
        
        // If height exceeds maxHeight, scale based on height
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }
        
        console.log("[PDFGenerator] Adding signature with dimensions:", { width, height });
        
        // Add signature image with calculated dimensions
        doc.addImage(signatureData, 'PNG', 20, yPosition, width, height);
      } catch (error) {
        console.error("[PDFGenerator] Error adding signature:", error);
        doc.text("Signature :", 20, yPosition);
      }
    } else {
      doc.text("Signature :", 20, yPosition);
    }

    return doc.output('dataurlstring');
  }
}