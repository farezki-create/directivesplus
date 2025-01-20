import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, startY: number): number {
    let yPosition = startY;
    doc.setFontSize(12);

    if (profile) {
      console.log("[PDFUserSection] Generating user section with profile:", profile);

      // Full name
      const fullName = `${profile.last_name || ''} ${profile.first_name || ''}`.trim();
      if (fullName) {
        doc.text(`Nom et prénom : ${fullName}`, 20, yPosition);
        yPosition += 10;
      }

      // Birth date
      if (profile.birth_date) {
        try {
          const formattedDate = format(new Date(profile.birth_date), "d MMMM yyyy", { locale: fr });
          doc.text(`Date de naissance : ${formattedDate}`, 20, yPosition);
          yPosition += 10;
        } catch (error) {
          console.error("[PDFUserSection] Error formatting birth date:", error);
        }
      }

      // Email
      if (profile.email) {
        doc.text(`Email : ${profile.email}`, 20, yPosition);
        yPosition += 10;
      }

      // Phone number
      if (profile.phone_number) {
        doc.text(`Téléphone : ${profile.phone_number}`, 20, yPosition);
        yPosition += 10;
      }

      // Address section
      const hasAddress = profile.address || profile.postal_code || profile.city || profile.country;
      if (hasAddress) {
        doc.text("Adresse :", 20, yPosition);
        yPosition += 7;

        if (profile.address) {
          doc.text(profile.address, 30, yPosition);
          yPosition += 7;
        }

        const cityLine = [profile.postal_code, profile.city]
          .filter(Boolean)
          .join(" ");
        if (cityLine) {
          doc.text(cityLine, 30, yPosition);
          yPosition += 7;
        }

        if (profile.country) {
          doc.text(profile.country, 30, yPosition);
          yPosition += 10;
        }
      }

      // Access code section with connection link
      doc.text("Code d'accès :", 20, yPosition);
      yPosition += 7;
      doc.text(`${profile.unique_identifier}`, 30, yPosition);
      yPosition += 7;
      doc.text("Lien de connexion :", 20, yPosition);
      yPosition += 7;
      doc.setTextColor(0, 0, 255); // Set text color to blue for the link
      doc.text("https://directives-anticipees.lovable.dev", 30, yPosition);
      doc.setTextColor(0, 0, 0); // Reset text color to black
      yPosition += 10;

    } else {
      console.warn("[PDFUserSection] No profile data provided");
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}