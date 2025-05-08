
import { jsPDF } from "jspdf";
import { cardDimensions } from "@/components/pdf/utils/constants/cardDimensions";

export interface MedicalProfile {
  last_name?: string;
  first_name?: string;
  birth_date?: string;
  unique_identifier?: string;
  blood_type?: string;
  allergies?: string[];
  address?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  medical_access_code?: string; // Ajout du code d'accès médical
}

export class MedicalCardGenerator {
  static generate(doc: jsPDF, profile: MedicalProfile): void {
    this.setBackground(doc);
    this.addHeader(doc);
    this.addUserInformation(doc, profile);
    this.addMedicalInformation(doc, profile);
    this.addAccessCode(doc, profile);
    this.addWebsite(doc);
  }

  private static setBackground(doc: jsPDF): void {
    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, cardDimensions.width, cardDimensions.height, 'F');
  }

  private static addHeader(doc: jsPDF): void {
    // Purple header for card title
    doc.setFillColor(138, 43, 226); // Purple background
    doc.rect(0, 0, cardDimensions.width, 12, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("CARTE D'ACCÈS AUX DONNÉES MÉDICALES", cardDimensions.width / 2, 7, { align: "center" });
  }

  private static addUserInformation(doc: jsPDF, profile: MedicalProfile): void {
    // Add personal information
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    const startY = 18;
    const lineHeight = 5;
    const col1X = 5;
    const col2X = cardDimensions.width / 2 + 5;

    // Left column
    // Add name
    doc.setFont("helvetica", "bold");
    doc.text("Nom:", col1X, startY);
    doc.setFont("helvetica", "normal");
    doc.text(profile.last_name?.toUpperCase() || "", col1X + 18, startY);

    // Add first name
    doc.setFont("helvetica", "bold");
    doc.text("Prénom:", col1X, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(profile.first_name || "", col1X + 18, startY + lineHeight);

    // Add birth date
    doc.setFont("helvetica", "bold");
    doc.text("Date naissance:", col1X, startY + (lineHeight * 2));
    doc.setFont("helvetica", "normal");
    doc.text(profile.birth_date || "", col1X + 26, startY + (lineHeight * 2));

    // Right column - Contact information
    if (profile.phone_number) {
      doc.setFont("helvetica", "bold");
      doc.text("Tél:", col2X, startY);
      doc.setFont("helvetica", "normal");
      doc.text(profile.phone_number || "", col2X + 15, startY);
    }
    
    // Add address if available
    if (profile.address || profile.city || profile.postal_code) {
      doc.setFont("helvetica", "bold");
      doc.text("Adresse:", col2X, startY + lineHeight);
      doc.setFont("helvetica", "normal");
      
      if (profile.address) {
        doc.text(profile.address, col2X + 15, startY + lineHeight);
      }
      
      const cityPostalText = [profile.postal_code, profile.city].filter(Boolean).join(" ");
      if (cityPostalText) {
        doc.text(cityPostalText, col2X + 15, startY + (lineHeight * 2));
      }
    }
    
    // Add a line below personal info
    doc.setDrawColor(138, 43, 226); // Purple line
    doc.setLineWidth(0.5);
    doc.line(5, startY + (lineHeight * 3) + 1, cardDimensions.width - 5, startY + (lineHeight * 3) + 1);
  }
  
  private static addMedicalInformation(doc: jsPDF, profile: MedicalProfile): void {
    const startY = 38;
    
    // Add blood type if available
    if (profile.blood_type) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text("Groupe sanguin:", 5, startY);
      
      doc.setFont("helvetica", "normal");
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(35, startY - 4, 15, 5, 1, 1, 'F');
      doc.text(profile.blood_type, 42.5, startY, { align: "center" });
    }
    
    // Add allergies if available
    if (profile.allergies && profile.allergies.length > 0) {
      const allergiesY = startY + (profile.blood_type ? 7 : 0);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Allergies:", 5, allergiesY);
      
      doc.setFont("helvetica", "normal");
      const allergiesText = profile.allergies.slice(0, 3).join(", ");
      doc.text(allergiesText, 25, allergiesY);
    }
  }
  
  private static addWebsite(doc: jsPDF): void {
    // Add website in the middle of the card
    const websiteY = 50;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(138, 43, 226); // Purple text
    doc.text("www.directivesplus.fr", cardDimensions.width / 2, websiteY, { align: "center" });
  }
  
  private static addAccessCode(doc: jsPDF, profile: MedicalProfile): void {
    const codeY = 58;
    
    // Add a background rectangle for the access code
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(5, codeY - 4, cardDimensions.width - 10, 10, 2, 2, 'F');
    
    // Add access code title and medical access code if available
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(138, 43, 226); // Purple text
    
    // Display the medical access code if available, otherwise fallback to unique_identifier
    if (profile.medical_access_code) {
      doc.text("Code d'accès médical:", cardDimensions.width / 2, codeY, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(profile.medical_access_code, cardDimensions.width / 2, codeY + 5, { align: "center" });
    } else {
      // Fallback to professional access code
      doc.text("Code d'accès professionnel:", cardDimensions.width / 2, codeY, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(profile.unique_identifier || "Code non défini", cardDimensions.width / 2, codeY + 5, { align: "center" });
    }
  }
}
