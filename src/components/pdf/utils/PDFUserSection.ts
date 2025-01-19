import { jsPDF } from "jspdf";
import { UserProfile } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class PDFUserSection {
  static generate(doc: jsPDF, profile: UserProfile, startY: number): number {
    let yPosition = startY;
    doc.setFontSize(12);

    if (profile) {
      // Full name
      doc.text(`Nom et prénom : ${profile.last_name} ${profile.first_name}`, 20, yPosition);
      yPosition += 10;

      // Birth date if available
      if (profile.birth_date) {
        const formattedDate = format(new Date(profile.birth_date), "d MMMM yyyy", { locale: fr });
        doc.text(`Date de naissance : ${formattedDate}`, 20, yPosition);
        yPosition += 10;
      }

      // Address
      if (profile.address) {
        doc.text(`Adresse : ${profile.address}`, 20, yPosition);
        yPosition += 10;
      }

      // City and postal code
      if (profile.postal_code || profile.city) {
        doc.text(`${profile.postal_code || ""} ${profile.city || ""}`, 20, yPosition);
        yPosition += 10;
      }

      // Country
      if (profile.country) {
        doc.text(`Pays : ${profile.country}`, 20, yPosition);
        yPosition += 10;
      }

      // Phone
      if (profile.phone_number) {
        doc.text(`Téléphone : ${profile.phone_number}`, 20, yPosition);
        yPosition += 10;
      }

      // Email
      if (profile.email) {
        doc.text(`Email : ${profile.email}`, 20, yPosition);
        yPosition += 10;
      }

      // Access code
      yPosition += 5;
      doc.text(`Code d'accès pour les professionnels de santé : ${profile.unique_identifier}`, 20, yPosition);
      yPosition += 10;
    }

    return yPosition;
  }
}