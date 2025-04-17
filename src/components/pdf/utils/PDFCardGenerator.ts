
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QRCode } from "qrcode";

export class PDFCardGenerator {
  static async generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Generating foldable double-card PDF");
    
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

    // Function to generate a single card side
    const generateCard = (
      title: string,
      startX: number,
      startY: number,
      isDirectivesCard: boolean
    ) => {
      // Add a light background color and border
      doc.setFillColor(245, 245, 250);
      doc.rect(startX, startY, cardWidth, cardHeight, 'F');
      
      // Add a border
      doc.setDrawColor(100, 100, 150);
      doc.setLineWidth(0.5);
      doc.rect(startX + 2, startY + 2, cardWidth - 4, cardHeight - 4, 'S');
      
      // Add a header title
      doc.setFillColor(70, 70, 120);
      doc.rect(startX, startY, cardWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(title, startX + cardWidth/2, startY + 4.5, { align: 'center' });
      
      // Reset text color and font for content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      
      // Content position
      let contentY = startY + 12;

      // Full name
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      const fullName = `${lastName.toUpperCase()} ${firstName}`.trim();
      
      if (fullName) {
        doc.setFont("helvetica", "bold");
        doc.text(`NOM / PRÉNOM : `, startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${fullName}`, startX + 28, contentY);
        contentY += 5;
      }

      // Birth date
      if (profile.birth_date) {
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.setFont("helvetica", "bold");
        doc.text(`DATE DE NAISSANCE : `, startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${formattedDate}`, startX + 33, contentY);
        contentY += 5;
      }
      
      // Access code (unique identifier)
      doc.setFont("helvetica", "bold");
      doc.text(`CODE D'ACCÈS :`, startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(`${profile.unique_identifier}`, startX + 26, contentY);
      contentY += 5;

      // Connection link
      doc.setFont("helvetica", "bold");
      doc.text(`LIEN : `, startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(
        isDirectivesCard ? "directives.sante.fr/access" : "documents.sante.fr/access", 
        startX + 15, 
        contentY
      );
      doc.setTextColor(0, 0, 0);
      contentY += 5;

      // Trusted person for directives card only
      if (isDirectivesCard && trustedPersons && trustedPersons.length > 0) {
        const person = trustedPersons[0];
        doc.setFont("helvetica", "bold");
        doc.text(`PERSONNE DE CONFIANCE : `, startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(`${person.name}`, startX + 42, contentY);
        contentY += 5;
      }

      // Date and signature
      doc.text(
        "Date : ..................  Signature : ..................", 
        startX + 5, 
        contentY + 2
      );
    };

    // Calculate positions for the cards
    const margin = (pageWidth - (cardWidth * 2)) / 3;
    const yPosition = 100; // Position on the page where the cards will be placed

    // Generate the first card (Directives Anticipées)
    generateCard("CARTE DIRECTIVES ANTICIPÉES", margin, yPosition, true);
    
    // Generate the second card (Documents Médicaux)
    generateCard("CARTE DOCUMENTS MÉDICAUX", margin * 2 + cardWidth, yPosition, false);

    // Add folding instructions
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("- - - - - - - - - - - Pliez ici - - - - - - - - - - -", pageWidth / 2, yPosition - 10, { align: 'center' });

    // Add dotted line for folding (using individual small lines instead of setLineDash)
    doc.setDrawColor(150, 150, 150);
    
    // Draw a series of small lines to create a dotted effect
    const lineLength = 2;
    const gapLength = 2;
    let currentX = margin;
    
    while (currentX < pageWidth - margin) {
      doc.line(currentX, yPosition - 5, currentX + lineLength, yPosition - 5);
      currentX += lineLength + gapLength;
    }

    // Add usage instructions
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(70, 70, 120);
    doc.text("Instructions :", margin, yPosition + cardHeight + 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const instructions = [
      "1. Découpez le long du contour extérieur",
      "2. Pliez selon la ligne pointillée",
      "3. Complétez la date et signez les deux cartes",
      "4. Conservez cette carte sur vous"
    ];
    
    let instructionY = yPosition + cardHeight + 30;
    instructions.forEach(instruction => {
      doc.text(instruction, margin, instructionY);
      instructionY += 8;
    });

    return doc.output('dataurlstring');
  }
}
