import { jsPDF } from "jspdf";
import { UserProfile } from "../types";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, yPosition: number): number {
    doc.setFontSize(12);
    
    if (profile) {
      doc.text(`Nom et prénom : ${profile.first_name} ${profile.last_name}`, 20, yPosition);
      yPosition += 7;
      
      if (profile.email) {
        doc.text(`Email : ${profile.email}`, 20, yPosition);
        yPosition += 7;
      }

      if (profile.address) {
        doc.text(`Adresse : ${profile.address}`, 20, yPosition);
        yPosition += 7;
      }

      if (profile.postal_code || profile.city) {
        doc.text(`${profile.postal_code || ""} ${profile.city || ""}`, 20, yPosition);
        yPosition += 7;
      }

      if (profile.phone_number) {
        doc.text(`Téléphone : ${profile.phone_number}`, 20, yPosition);
        yPosition += 7;
      }

      // Code d'accès
      yPosition += 5;
      doc.text(`Code d'accès pour les professionnels de santé : ${profile.unique_identifier}`, 20, yPosition);
    }

    return yPosition;
  }
}