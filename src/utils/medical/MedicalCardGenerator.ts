
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
    doc.text("CARTE D'ACCÈS AUX DIRECTIVES ANTICIPÉES", cardDimensions.width / 2, 7, { align: "center" });
  }

  private static addUserInformation(doc: jsPDF, profile: MedicalProfile): void {
    // Add personal information
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    const startY = 20;
    const lineHeight = 6;

    // Add name
    doc.setFont("helvetica", "bold");
    doc.text("Nom:", 5, startY);
    doc.setFont("helvetica", "normal");
    doc.text(profile.last_name?.toUpperCase() || "", 25, startY);

    // Add first name
    doc.setFont("helvetica", "bold");
    doc.text("Prénom:", 5, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(profile.first_name || "", 25, startY + lineHeight);

    // Add birth date
    doc.setFont("helvetica", "bold");
    doc.text("Date de naissance:", 5, startY + (lineHeight * 2));
    doc.setFont("helvetica", "normal");
    doc.text(profile.birth_date || "", 40, startY + (lineHeight * 2));
    
    // Add underline below birth date
    doc.setDrawColor(138, 43, 226); // Purple line
    doc.setLineWidth(0.5);
    doc.line(5, startY + (lineHeight * 2) + 3, cardDimensions.width - 5, startY + (lineHeight * 2) + 3);
  }
  
  private static addWebsite(doc: jsPDF): void {
    // Add website in the middle of the card
    const websiteY = 42;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(138, 43, 226); // Purple text
    doc.text("www.directivesplus.fr", cardDimensions.width / 2, websiteY, { align: "center" });
  }
  
  private static addAccessCode(doc: jsPDF, profile: MedicalProfile): void {
    const codeY = 47;
    
    // Add access code title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(138, 43, 226); // Purple text
    doc.text("Code d'accès professionnel:", cardDimensions.width / 2, codeY, { align: "center" });
    
    // Add the actual code
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(profile.unique_identifier || "Code non défini", cardDimensions.width / 2, codeY + 5, { align: "center" });
  }
}
