
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
        doc.text("NOM / PRÉNOM : ", startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(fullName, startX + 28, contentY);
        contentY += 5;
      }

      // Birth date
      if (profile.birth_date) {
        const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
        doc.setFont("helvetica", "bold");
        doc.text("DATE DE NAISSANCE : ", startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(formattedDate, startX + 33, contentY);
        contentY += 5;
      }
      
      // Access code (unique identifier)
      doc.setFont("helvetica", "bold");
      doc.text("CODE D'ACCÈS :", startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(profile.unique_identifier, startX + 26, contentY);
      contentY += 5;

      // URL fixe pour l'accès aux documents - mise à jour pour directivesplus.com
      const accessUrl = "https://888b4fe0-9edf-469c-bb32-652a4b2227bb.directivesplus.com/my-documents";
        
      doc.setFont("helvetica", "bold");
      doc.text("ACCÈS EN LIGNE : ", startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      
      // L'URL peut être longue, on la divise en deux lignes si nécessaire
      // Cela garantit qu'elle est lisible sur la carte imprimée
      if (accessUrl.length > 30) {
        const firstPart = accessUrl.substring(0, 30);
        const secondPart = accessUrl.substring(30);
        doc.text(firstPart, startX + 28, contentY);
        doc.text(secondPart, startX + 28, contentY + 3);
        contentY += 8; // Extra space for the second line
      } else {
        doc.text(accessUrl, startX + 28, contentY);
        contentY += 5;
      }

      // Trusted person for directives card only
      if (isDirectivesCard && trustedPersons && trustedPersons.length > 0) {
        const person = trustedPersons[0];
        doc.setFont("helvetica", "bold");
        doc.text("PERSONNE DE CONFIANCE : ", startX + 5, contentY);
        doc.setFont("helvetica", "normal");
        doc.text(person.name, startX + 42, contentY);
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

    // Draw a series of small lines to create a dotted effect for folding line
    doc.setDrawColor(150, 150, 150);
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
      "4. Conservez cette carte sur vous",
      "5. Partagez le code d'accès avec les personnes concernées"
    ];
    
    let instructionY = yPosition + cardHeight + 30;
    instructions.forEach(instruction => {
      doc.text(instruction, margin, instructionY);
      instructionY += 8;
    });

    // Add sharing instructions
    doc.setFillColor(240, 245, 255);
    doc.rect(margin, instructionY + 5, pageWidth - (margin * 2), 25, 'F');
    doc.setTextColor(70, 70, 120);
    doc.setFont("helvetica", "bold");
    doc.text("Comment partager vos directives en ligne :", margin, instructionY + 15);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text([
      "1. Communiquez le code d'accès à la personne concernée",
      "2. Dirigez-la vers https://888b4fe0-9edf-469c-bb32-652a4b2227bb.directivesplus.com/my-documents",
      "3. Elle pourra accéder à vos documents en utilisant le code d'accès et vos informations personnelles"
    ], margin, instructionY + 20);

    return doc.output('dataurlstring');
  }
}
