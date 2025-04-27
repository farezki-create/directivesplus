
import { jsPDF } from "jspdf";
import { UserProfile } from "../../types";
import { cardDimensions } from "../constants/cardDimensions";
import { cardStyles } from "./CardStyles";

export class AccessCardGenerator {
  static generate(doc: jsPDF, profile: UserProfile): void {
    this.setBackground(doc);
    this.addHeader(doc);
    this.addUserInformation(doc, profile);
    this.addAccessCode(doc, profile);
    this.addDecorativeElements(doc);
  }

  private static setBackground(doc: jsPDF): void {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, cardDimensions.width, cardDimensions.height, 'F');
  }

  private static addHeader(doc: jsPDF): void {
    const { header } = cardStyles;
    doc.setFillColor(...header.backgroundColor);
    doc.rect(0, 0, cardDimensions.width, header.height, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(header.titleFontSize);
    doc.setTextColor(...header.textColor);
    doc.text("CARTE D'ACCÈS AUX DIRECTIVES ANTICIPÉES", cardDimensions.width / 2, 8, { align: "center" });
  }

  private static addUserInformation(doc: jsPDF, profile: UserProfile): void {
    const { content, website } = cardStyles;
    doc.setFontSize(content.labelFontSize);
    doc.setTextColor(...content.textColor);

    const startY = content.startY;
    const lineHeight = content.lineHeight;

    // Add name
    doc.setFont("helvetica", "bold");
    doc.text("Nom:", 6, startY);
    doc.setFont("helvetica", "normal");
    doc.text(profile.last_name || "", 20, startY);

    // Add first name
    doc.setFont("helvetica", "bold");
    doc.text("Prénom:", 6, startY + lineHeight);
    doc.setFont("helvetica", "normal");
    doc.text(profile.first_name || "", 20, startY + lineHeight);

    // Add birth date
    doc.setFont("helvetica", "bold");
    doc.text("Date de naissance:", 6, startY + (lineHeight * 2));
    doc.setFont("helvetica", "normal");
    doc.text(profile.birth_date || "", 32, startY + (lineHeight * 2));

    // Add website link right below birth date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(website.fontSize);
    doc.setTextColor(...website.textColor);
    doc.text("www.directivesplus.fr", cardDimensions.width / 2, startY + (lineHeight * 3), { align: "center" });
  }

  private static addAccessCode(doc: jsPDF, profile: UserProfile): void {
    const { accessCode } = cardStyles;
    
    doc.setFillColor(...accessCode.backgroundColor);
    doc.roundedRect(4, cardDimensions.height - 10, cardDimensions.width - 8, 7, 1, 1, 'F');
    
    doc.setFontSize(accessCode.fontSize);
    doc.setTextColor(...accessCode.textColor);
    
    doc.setFont("helvetica", "bold");
    doc.text("Code d'accès professionnel:", cardDimensions.width / 2, cardDimensions.height - 7, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text(profile.unique_identifier || "", cardDimensions.width / 2, cardDimensions.height - 3, { align: "center" });
  }

  private static addDecorativeElements(doc: jsPDF): void {
    const { decorativeLine } = cardStyles;
    doc.setDrawColor(...decorativeLine.color);
    doc.setLineWidth(decorativeLine.width);
    doc.line(4, 35, cardDimensions.width - 4, 35);
  }
}
