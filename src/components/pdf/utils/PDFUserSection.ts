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

      // Birth date if available
      if (profile.birth_date) {
        try {
          const formattedDate = format(new Date(profile.birth_date), "d MMMM yyyy", { locale: fr });
          doc.text(`Date de naissance : ${formattedDate}`, 20, yPosition);
          yPosition += 10;
        } catch (error) {
          console.error("[PDFUserSection] Error formatting birth date:", error);
        }
      }

      // Complete address
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

      // Contact information
      if (profile.phone_number) {
        doc.text(`Téléphone : ${profile.phone_number}`, 20, yPosition);
        yPosition += 10;
      }

      if (profile.email) {
        doc.text(`Email : ${profile.email}`, 20, yPosition);
        yPosition += 10;
      }

      // Access code
      yPosition += 5;
      doc.text(`Code d'accès pour les professionnels de santé : ${profile.unique_identifier}`, 20, yPosition);
      yPosition += 10;
    } else {
      console.warn("[PDFUserSection] No profile data provided");
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}