
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile } from "../types";

export class DocumentFooter {
  /**
   * Add the document footer with signature section
   */
  static addSignatureSection(doc: jsPDF, profile: UserProfile, yPosition: number): number {
    doc.setFontSize(12);
    
    // Section "Je soussigné(e)" centrée
    doc.text(
      "Je soussigné(e)",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
    
    // Full name
    const fullName = profile ? 
      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Non renseigné' : 
      'Non renseigné';
    
    doc.text(
      fullName,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    
    yPosition += 15;
    
    // Date and location
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    const location = profile?.city ? `à ${profile.city}` : '';
    doc.text(
      `Fait le ${today} ${location}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    
    return yPosition + 15;
  }
}
