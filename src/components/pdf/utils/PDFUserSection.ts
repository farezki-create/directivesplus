
import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, startY: number): number {
    let yPosition = startY;
    
    // Style pour les labels
    const labelStyle = () => {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
    };

    // Style pour les valeurs
    const valueStyle = () => {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
    };

    if (profile) {
      console.log("[PDFUserSection] Generating user section with profile:", profile);

      // Nom et prénom
      labelStyle();
      doc.text("Nom :", 20, yPosition);
      valueStyle();
      doc.text(profile.last_name?.toUpperCase() || '', 60, yPosition);
      yPosition += 10;

      labelStyle();
      doc.text("Prénom :", 20, yPosition);
      valueStyle();
      doc.text(profile.first_name || '', 60, yPosition);
      yPosition += 10;

      // Date de naissance
      if (profile.birth_date) {
        try {
          labelStyle();
          doc.text("Date de naissance :", 20, yPosition);
          valueStyle();
          const formattedDate = format(new Date(profile.birth_date), "d MMMM yyyy", { locale: fr });
          doc.text(formattedDate, 60, yPosition);
          yPosition += 10;
        } catch (error) {
          console.error("[PDFUserSection] Error formatting birth date:", error);
        }
      }

      // Section adresse
      const hasAddress = profile.address || profile.postal_code || profile.city || profile.country;
      if (hasAddress) {
        yPosition += 5;
        labelStyle();
        doc.text("Adresse :", 20, yPosition);
        yPosition += 7;
        valueStyle();

        if (profile.address) {
          doc.text(profile.address, 30, yPosition);
          yPosition += 7;
        }

        // Code postal et ville sur la même ligne
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
