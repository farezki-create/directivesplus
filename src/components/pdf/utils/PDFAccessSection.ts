import { jsPDF } from "jspdf";
import { UserProfile } from "../types";

export class PDFAccessSection {
  static generate(doc: jsPDF, profile: UserProfile, yPosition: number): number {
    doc.setFontSize(16);
    doc.text("2. Accès au document", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Code d'accès : ${profile.unique_identifier}`, 20, yPosition);
    yPosition += 10;
    doc.text("URL de connexion : https://directives-anticipees.fr", 20, yPosition);
    yPosition += 20;
    
    return yPosition;
  }
}