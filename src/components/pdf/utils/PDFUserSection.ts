
import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { format, isValid, parseISO } from "date-fns";
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
      doc.text(profile.last_name?.toUpperCase() || 'Non renseigné', 60, yPosition);
      yPosition += 10;

      labelStyle();
      doc.text("Prénom :", 20, yPosition);
      valueStyle();
      doc.text(profile.first_name || 'Non renseigné', 60, yPosition);
      yPosition += 10;

      // Date de naissance - Improved handling
      labelStyle();
      doc.text("Date de naissance :", 20, yPosition);
      valueStyle();
      
      if (profile.birth_date) {
        try {
          // Try different date formats and validations
          const dateObj = parseISO(profile.birth_date);
          if (isValid(dateObj)) {
            const formattedDate = format(dateObj, "d MMMM yyyy", { locale: fr });
            doc.text(formattedDate, 60, yPosition);
          } else {
            doc.text('Non renseignée', 60, yPosition);
          }
        } catch (error) {
          console.error("[PDFUserSection] Error formatting birth date:", error);
          doc.text('Non renseignée', 60, yPosition);
        }
      } else {
        doc.text('Non renseignée', 60, yPosition);
      }
      yPosition += 10;

      // Section adresse - Improved display
      labelStyle();
      doc.text("Adresse :", 20, yPosition);
      valueStyle();
      
      const hasAddress = profile.address || profile.postal_code || profile.city || profile.country;
      
      if (hasAddress) {
        yPosition += 7;
        
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
          yPosition += 7;
        }
      } else {
        doc.text('Non renseignée', 60, yPosition);
        yPosition += 7;
      }

    } else {
      console.warn("[PDFUserSection] No profile data provided");
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}
