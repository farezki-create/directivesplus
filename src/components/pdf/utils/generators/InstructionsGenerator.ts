
import { jsPDF } from "jspdf";
import { pageLayout } from "../constants/cardDimensions";
import { pdfStyles } from "../styles/pdfStyles";

export class InstructionsGenerator {
  static addFoldingInstructions(doc: jsPDF): void {
    pdfStyles.setTitleStyle(doc);
    doc.text(
      "- - - - - - - - - - - Pliez ici - - - - - - - - - - -",
      pageLayout.width / 2,
      pageLayout.cardsStartY - 10,
      { align: 'center' }
    );

    // Draw dotted folding line
    doc.setDrawColor(150, 150, 150);
    const lineLength = 2;
    const gapLength = 2;
    let currentX = pageLayout.margin;
    
    while (currentX < pageLayout.width - pageLayout.margin) {
      doc.line(currentX, pageLayout.cardsStartY - 5, currentX + lineLength, pageLayout.cardsStartY - 5);
      currentX += lineLength + gapLength;
    }
  }

  static addUsageInstructions(doc: jsPDF, margin: number, startY: number): void {
    pdfStyles.setTitleStyle(doc);
    doc.text("Instructions :", margin, startY + 20);
    
    pdfStyles.setInstructionStyle(doc);
    const instructions = [
      "1. Découpez le long du contour extérieur",
      "2. Pliez selon la ligne pointillée",
      "3. Complétez la date et signez les deux cartes",
      "4. Conservez cette carte sur vous",
      "5. Partagez le code d'accès avec les personnes concernées"
    ];
    
    let instructionY = startY + 30;
    instructions.forEach(instruction => {
      doc.text(instruction, margin, instructionY);
      instructionY += 8;
    });

    // Add sharing box with updated internal link
    doc.setFillColor(240, 245, 255);
    doc.rect(margin, instructionY + 5, pageLayout.width - (margin * 2), 25, 'F');
    doc.setTextColor(70, 70, 120);
    doc.setFont("helvetica", "bold");
    doc.text("Comment partager vos directives en ligne :", margin, instructionY + 15);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text([
      "1. Communiquez le code d'accès à la personne concernée",
      "2. Dirigez-la vers la page \"Accès aux documents\"",
      "3. Elle pourra accéder à vos documents avec le code d'accès et vos informations personnelles"
    ], margin, instructionY + 20);
  }
}
