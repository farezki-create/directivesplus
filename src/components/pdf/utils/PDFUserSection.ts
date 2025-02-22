
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
      const lastName = profile.last_name?.toUpperCase() || '';
      const firstName = profile.first_name || '';
      const fullName = `${lastName} ${firstName}`.trim();
      
      if (lastName || firstName) {
        doc.text(`Nom : ${lastName}`, 20, yPosition);
        yPosition += 10;
        doc.text(`Prénom : ${firstName}`, 20, yPosition);
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

    } else {
      console.warn("[PDFUserSection] No profile data provided");
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}
