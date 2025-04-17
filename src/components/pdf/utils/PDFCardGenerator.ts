
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QRCode } from "qrcode";

export class PDFCardGenerator {
  static async generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Generating double-sheet card PDF");
    
    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Credit card dimensions in mm (standard size: 85.6 × 53.98 mm)
    const cardWidth = 85.6;
    const cardHeight = 53.98;
    
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Function to generate a single card
    const generateCard = (
      title: string,
      yPosition: number,
      isDirectivesCard: boolean
    ) => {
      // Add a light background color and border
      doc.setFillColor(245, 245, 250);
      doc.rect((pageWidth - cardWidth) / 2, yPosition, cardWidth, cardHeight, 'F');
      
      // Add a border
      doc.setDrawColor(100, 100, 150);
      doc.setLineWidth(0.5);
      doc.rect((pageWidth - cardWidth) / 2 + 2, yPosition + 2, cardWidth - 4, cardHeight - 4, 'S');
      
      // Add a header title
      doc.setFillColor(70, 70, 120);
      doc.rect((pageWidth - cardWidth) / 2, yPosition, cardWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(title, pageWidth / 2, yPosition + 4.5, { align: 'center' });
      
      // Reset text color and font for content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      
      // Content position
      let contentY = yPosition + 12;

      // Full name
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();
      
      if (fullName) {
        doc.setFont("helvetica", "bold");
        doc.text(`NOM / PRÉNOM : `, (pageWidth - cardWidth) / 2 + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${fullName}`, (pageWidth - cardWidth) / 2 + 28, contentY);
        contentY += 5;
      }

      // Birth date
      if (profile.birth_date) {
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.setFont("helvetica", "bold");
        doc.text(`DATE DE NAISSANCE : `, (pageWidth - cardWidth) / 2 + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${formattedDate}`, (pageWidth - cardWidth) / 2 + 33, contentY);
        contentY += 5;
      }
      
      // Access code (unique identifier)
      doc.setFont("helvetica", "bold");
      doc.text(`CODE D'ACCÈS :`, (pageWidth - cardWidth) / 2 + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(`${profile.unique_identifier}`, (pageWidth - cardWidth) / 2 + 26, contentY);
      contentY += 5;

      // Connection link
      doc.setFont("helvetica", "bold");
      doc.text(`LIEN : `, (pageWidth - cardWidth) / 2 + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(
        isDirectivesCard ? "directives.sante.fr/access" : "documents.sante.fr/access", 
        (pageWidth - cardWidth) / 2 + 15, 
        contentY
      );
      doc.setTextColor(0, 0, 0);
      contentY += 5;

      // Trusted person for directives card only
      if (isDirectivesCard && trustedPersons && trustedPersons.length > 0) {
        const person = trustedPersons[0];
        doc.setFont("helvetica", "bold");
        doc.text(`PERSONNE DE CONFIANCE : `, (pageWidth - cardWidth) / 2 + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${person.name}`, (pageWidth - cardWidth) / 2 + 42, contentY);
        contentY += 5;
      }

      // Date and signature
      doc.text(
        "Date : ..................  Signature : ..................", 
        (pageWidth - cardWidth) / 2 + 5, 
        contentY + 2
      );
    };

    // First page: Directives Anticipées
    generateCard("CARTE DIRECTIVES ANTICIPÉES", 50, true);

    // Second page: Documents Médicaux
    doc.addPage();
    generateCard("CARTE DOCUMENTS MÉDICAUX", 50, false);

    return doc.output('dataurlstring');
  }
}
