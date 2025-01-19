import { jsPDF } from "jspdf";
import { UserProfile } from "../types";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, yPosition: number): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    
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

    return yPosition;
  }
}