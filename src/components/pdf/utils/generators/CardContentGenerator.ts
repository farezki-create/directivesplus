import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../../types";
import { cardDimensions } from "../constants/cardDimensions";
import { pdfStyles } from "../styles/pdfStyles";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export class CardContentGenerator {
  static generateCardContent(
    doc: jsPDF,
    title: string,
    startX: number,
    startY: number,
    profile: UserProfile,
    isDirectivesCard: boolean,
    trustedPersons: TrustedPerson[]
  ): void {
    // Add background and border
    doc.setFillColor(245, 245, 250);
    doc.rect(startX, startY, cardDimensions.width, cardDimensions.height, 'F');
    
    doc.setDrawColor(100, 100, 150);
    doc.setLineWidth(0.5);
    doc.rect(
      startX + cardDimensions.margins.outer, 
      startY + cardDimensions.margins.outer, 
      cardDimensions.width - (cardDimensions.margins.outer * 2), 
      cardDimensions.height - (cardDimensions.margins.outer * 2), 
      'S'
    );
    
    // Add header title
    pdfStyles.setHeaderStyle(doc);
    doc.rect(startX, startY, cardDimensions.width, cardDimensions.margins.header, 'F');
    doc.text(title, startX + cardDimensions.width/2, startY + 4.5, { align: 'center' });
    
    // Reset style for content
    pdfStyles.setContentStyle(doc);
    
    // Find the current content Y position after previous entries
    let contentY = startY + cardDimensions.margins.contentStartY;
    
    // Add user information
    const fullName = `${profile.last_name?.toUpperCase() || ''} ${profile.first_name || ''}`.trim();
    if (fullName) {
      doc.setFont("helvetica", "bold");
      doc.text("NOM / PRÉNOM : ", startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(fullName, startX + 28, contentY);
      contentY += cardDimensions.margins.lineSpacing;
    }

    // Birth date
    if (profile.birth_date) {
      const formattedDate = format(new Date(profile.birth_date), "dd/MM/yyyy", { locale: fr });
      doc.setFont("helvetica", "bold");
      doc.text("DATE DE NAISSANCE : ", startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(formattedDate, startX + 33, contentY);
      contentY += cardDimensions.margins.lineSpacing;
    }
    
    // Access code - Now with differentiated codes for each card
    doc.setFont("helvetica", "bold");
    doc.text("CODE D'ACCÈS :", startX + 5, contentY);
    doc.setFont("helvetica", "normal");
    
    const uniqueId = profile.unique_identifier || '';
    let codeToDisplay;
    
    // Generate different codes for each card
    if (isDirectivesCard) {
      // Pour la carte Directives Anticipées: préfixe DA-
      codeToDisplay = `DA-${uniqueId.substring(0, 8)}`;
    } else {
      // Pour la carte Documents Médicaux: préfixe DM-
      codeToDisplay = `DM-${uniqueId.substring(0, 8)}`;
    }
    
    doc.text(codeToDisplay, startX + 26, contentY);
    contentY += cardDimensions.margins.lineSpacing;

    // URL - Removed external URL in favor of app instructions
    doc.setFont("helvetica", "bold");
    doc.text("ACCÈS : ", startX + 5, contentY);
    doc.setFont("helvetica", "normal");
    doc.text("directivesplus.fr", startX + 15, contentY);
    contentY += cardDimensions.margins.lineSpacing;

    // Type d'accès - Ajout d'une ligne pour clarifier le type d'accès
    doc.setFont("helvetica", "bold");
    doc.text("TYPE D'ACCÈS : ", startX + 5, contentY);
    doc.setFont("helvetica", "normal");
    doc.text(isDirectivesCard ? "Uniquement directives anticipées" : "Tous documents", startX + 25, contentY);
    contentY += cardDimensions.margins.lineSpacing;

    // Trusted person info for directives card
    if (isDirectivesCard && trustedPersons && trustedPersons.length > 0) {
      const person = trustedPersons[0];
      doc.setFont("helvetica", "bold");
      doc.text("PERSONNE DE CONFIANCE : ", startX + 5, contentY);
      doc.setFont("helvetica", "normal");
      doc.text(person.name, startX + 42, contentY);
      contentY += cardDimensions.margins.lineSpacing;
    }

    // Date and signature
    doc.text(
      "Date : ..................  Signature : ..................", 
      startX + 5, 
      contentY + 2
    );
  }
}
