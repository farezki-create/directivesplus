
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QRCode } from "qrcode";

export class PDFCardGenerator {
  static async generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Generating card-sized PDF");
    
    // Credit card dimensions in mm (standard size: 85.6 × 53.98 mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    
    const doc = new jsPDF({
      unit: 'mm',
      format: [cardHeight, cardWidth], // Swap dimensions for landscape
      orientation: 'landscape'
    });

    // Add a light background color and border
    doc.setFillColor(245, 245, 250); // Light blue-gray background
    doc.rect(0, 0, cardWidth, cardHeight, 'F');
    
    // Add a border
    doc.setDrawColor(100, 100, 150);
    doc.setLineWidth(0.5);
    doc.rect(2, 2, cardWidth - 4, cardHeight - 4, 'S');
    
    // Add a header title
    doc.setFillColor(70, 70, 120);
    doc.rect(0, 0, cardWidth, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CARTE DIRECTIVES ANTICIPÉES", cardWidth / 2, 4.5, { align: 'center' });
    
    // Reset text color and font for content
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    
    // Start position for content
    let yPosition = 12;

    // Full name
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();
    
    if (fullName) {
      doc.setFont("helvetica", "bold");
      doc.text(`NOM / PRÉNOM : `, 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${fullName}`, 28, yPosition);
      yPosition += 5;
    }

    // Birth date
    if (profile.birth_date) {
      try {
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.setFont("helvetica", "bold");
        doc.text(`DATE DE NAISSANCE : `, 5, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(`${formattedDate}`, 33, yPosition);
        yPosition += 5;
      } catch (error) {
        console.error("[PDFCardGenerator] Error formatting birth date:", error);
      }
    }
    
    // Address
    const addressParts = [];
    if (profile.address) addressParts.push(profile.address);
    if (profile.postal_code || profile.city) {
      const cityLine = [profile.postal_code, profile.city].filter(Boolean).join(" ");
      if (cityLine) addressParts.push(cityLine);
    }
    
    if (addressParts.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text(`ADRESSE : `, 5, yPosition);
      doc.setFont("helvetica", "normal");
      
      // Display first part of address
      doc.text(`${addressParts[0]}`, 18, yPosition);
      yPosition += 4;
      
      // Display second part of address if available
      if (addressParts.length > 1) {
        doc.text(`${addressParts[1]}`, 5, yPosition);
        yPosition += 5;
      } else {
        yPosition += 1;
      }
    }

    // Access code (unique identifier)
    doc.setFont("helvetica", "bold");
    doc.text(`CODE D'ACCÈS :`, 5, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(`${profile.unique_identifier}`, 26, yPosition);
    yPosition += 5;

    // Connection link
    doc.setFont("helvetica", "bold");
    doc.text(`LIEN : `, 5, yPosition);
    doc.setTextColor(0, 0, 255);
    doc.setFont("helvetica", "normal");
    doc.text("directives-anticipees.lovable.dev", 15, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 5;

    // Trusted person
    if (trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0];
      doc.setFont("helvetica", "bold");
      doc.text(`PERSONNE DE CONFIANCE : `, 5, yPosition);
      doc.setFont("helvetica", "normal");
      doc.text(`${person.name}`, 42, yPosition);
      yPosition += 5;
    }

    // Date and signature
    doc.text("Date : ..................  Signature : ..................", 5, yPosition + 2);

    return doc.output('dataurlstring');
  }
}
