
import { jsPDF } from "jspdf";
import { cardDimensions } from "@/components/pdf/utils/constants/cardDimensions";

export interface MedicalProfile {
  last_name?: string;
  first_name?: string;
  birth_date?: string;
  unique_identifier?: string;
  blood_type?: string;
  allergies?: string[];
}

export class MedicalCardGenerator {
  static generate(doc: jsPDF, profile: MedicalProfile): void {
    this.setBackground(doc);
    this.addHeader(doc);
    this.addUserInformation(doc, profile);
    this.addMedicalInformation(doc, profile);
    this.addDecorativeElements(doc);
    this.addFooter(doc);
  }

  private static setBackground(doc: jsPDF): void {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, cardDimensions.width, cardDimensions.height, 'F');
  }

  private static addHeader(doc: jsPDF): void {
    // Header with medical card title
    doc.setFillColor(220, 38, 38); // Red background for medical card
    doc.rect(0, 0, cardDimensions.width, 15, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("CARTE D'ACCÈS AUX DONNÉES MÉDICALES", cardDimensions.width / 2, 8, { align: "center" });
  }

  private static addUserInformation(doc: jsPDF, profile: MedicalProfile): void {
    // Add personal information
    doc.setFontSize(8);
    doc.setTextColor(31, 41, 55);

    const startY = 22;
    const lineHeight = 5;

    // Add name
    doc.setFont("helvetica", "bold");
    doc.text("Nom:", 6, startY);
    doc.setFont("helvetica", "normal");
    doc.text(profile.last_name || "", 20, startY);

    // Add first name
    doc.setFont("helvetica", "bold");
    doc.text("Prénom:", 6, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(profile.first_name || "", 20, startY + lineHeight);

    // Add birth date
    doc.setFont("helvetica", "bold");
    doc.text("Date de naissance:", 6, startY + (lineHeight * 2));
    doc.setFont("helvetica", "normal");
    doc.text(profile.birth_date || "", 32, startY + (lineHeight * 2));
  }

  private static addMedicalInformation(doc: jsPDF, profile: MedicalProfile): void {
    // Add medical information in the middle section
    const startY = 38;
    const lineHeight = 5;

    // Add blood type if available
    if (profile.blood_type) {
      doc.setFont("helvetica", "bold");
      doc.text("Groupe sanguin:", 6, startY);
      doc.setFont("helvetica", "normal");
      doc.text(profile.blood_type, 32, startY);
    }

    // Add allergies if available
    if (profile.allergies && profile.allergies.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Allergies:", 6, startY + lineHeight);
      
      // Limit to 2 allergies on the card to avoid overflow
      const allergiesText = profile.allergies.slice(0, 2).join(", ");
      doc.setFont("helvetica", "normal");
      doc.text(allergiesText, 32, startY + lineHeight);
    }
  }

  private static addDecorativeElements(doc: jsPDF): void {
    // Add decorative line
    doc.setDrawColor(220, 38, 38); // Red line
    doc.setLineWidth(0.5);
    doc.line(4, 35, cardDimensions.width - 4, 35);
  }

  private static addFooter(doc: jsPDF): void {
    // Add access code section at the bottom
    doc.setFillColor(220, 38, 38, 0.1); // Light red background
    doc.roundedRect(4, cardDimensions.height - 10, cardDimensions.width - 8, 7, 1, 1, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(31, 41, 55);
    
    doc.setFont("helvetica", "bold");
    doc.text("Code d'accès médical:", cardDimensions.width / 2, cardDimensions.height - 7, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text(profile.unique_identifier || "", cardDimensions.width / 2, cardDimensions.height - 3, { align: "center" });
    
    // Add website
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(220, 38, 38);
    doc.text("www.directivesplus.fr", cardDimensions.width / 2, cardDimensions.height - 12, { align: "center" });
  }
}
