
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile } from "../types";
import { PDFSignatureGenerator } from "./PDFSignatureGenerator";

export class PDFFooterGenerator {
  static async generate(doc: jsPDF, profile: UserProfile): Promise<void> {
    const totalPages = doc.internal.pages.length;
    
    // Récupérer la signature depuis la base de données
    const signatureData = await PDFSignatureGenerator.fetchSignature(profile.id);
    
    if (signatureData) {
      // Ajouter la signature à chaque page
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Ajouter la signature en bas de page
        const pageHeight = doc.internal.pageSize.getHeight();
        const signatureHeight = 20;
        const margin = { left: 20, bottom: 20 };
        
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Non renseigné';
        
        doc.addImage(
          signatureData,
          'PNG',
          margin.left,
          pageHeight - margin.bottom - signatureHeight,
          30,
          signatureHeight
        );

        // Ajouter le texte à côté de la signature
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(
          `Signé par ${fullName} le ${format(new Date(), "d MMMM yyyy", { locale: fr })}`,
          margin.left + 35,
          pageHeight - margin.bottom - signatureHeight / 2
        );
      }
    }

    // Numérotation des pages
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i}/${totalPages}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
  }
}
