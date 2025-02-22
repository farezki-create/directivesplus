
import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, startY: number): number {
    let yPosition = startY;
    
    const labelStyle = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
    };

    const valueStyle = () => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
    };

    if (profile) {
      // Nom et prénom sur la même ligne
      labelStyle();
      doc.text("Nom et prénom :", 20, yPosition);
      valueStyle();
      const fullName = `${profile.last_name?.toUpperCase() || ''} ${profile.first_name || ''}`;
      doc.text(fullName, 60, yPosition);
      yPosition += 5;

      // Date de naissance
      if (profile.birth_date) {
        try {
          labelStyle();
          doc.text("Né(e) le :", 20, yPosition);
          valueStyle();
          const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
          doc.text(formattedDate, 60, yPosition);
          yPosition += 5;
        } catch (error) {
          console.error("[PDFUserSection] Error formatting birth date:", error);
        }
      }

      // Section adresse condensée
      const hasAddress = profile.address || profile.postal_code || profile.city || profile.country;
      if (hasAddress) {
        labelStyle();
        doc.text("Adresse :", 20, yPosition);
        valueStyle();
        
        const addressLines = [];
        if (profile.address) addressLines.push(profile.address);
        if (profile.postal_code || profile.city) {
          addressLines.push(`${profile.postal_code || ''} ${profile.city || ''}`.trim());
        }
        if (profile.country) addressLines.push(profile.country);

        addressLines.forEach((line) => {
          doc.text(line, 60, yPosition);
          yPosition += 5;
        });
      }

    } else {
      console.warn("[PDFUserSection] No profile data provided");
      doc.text("Information d'identité non disponible", 20, yPosition);
      yPosition += 5;
    }

    return yPosition;
  }
}
