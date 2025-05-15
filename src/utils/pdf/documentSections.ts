
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";
import { checkPageBreak } from "./helpers";

export const renderHeader = (pdf: jsPDF, layout: PdfLayout, yPosition: number): number => {
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("DIRECTIVES ANTICIPÉES", layout.pageWidth / 2, yPosition, { align: "center" });
  
  yPosition += layout.lineHeight * 2;
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Document créé le " + new Date().toLocaleDateString('fr-FR'), layout.pageWidth / 2, yPosition, { align: "center" });
  
  return yPosition + layout.lineHeight * 3;
};

export const renderPersonalInfo = (pdf: jsPDF, layout: PdfLayout, yPosition: number, profileData: any): number => {
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("INFORMATIONS PERSONNELLES", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  if (profileData) {
    pdf.text(`Nom: ${profileData.last_name || 'Non renseigné'}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Prénom: ${profileData.first_name || 'Non renseigné'}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Date de naissance: ${profileData.birth_date ? new Date(profileData.birth_date).toLocaleDateString('fr-FR') : 'Non renseignée'}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Adresse: ${profileData.address || 'Non renseignée'}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Téléphone: ${profileData.phone || 'Non renseigné'}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Email: ${profileData.email || 'Non renseigné'}`, 20, yPosition);
    yPosition += layout.lineHeight * 2;
  } else {
    pdf.text("Aucune information personnelle disponible", 20, yPosition);
    yPosition += layout.lineHeight * 2;
  }
  
  return yPosition;
};

export const renderTrustedPersons = (pdf: jsPDF, layout: PdfLayout, yPosition: number, trustedPersons: any[]): number => {
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("PERSONNES DE CONFIANCE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  
  if (!trustedPersons || trustedPersons.length === 0) {
    pdf.setFont("helvetica", "normal");
    pdf.text("Aucune personne de confiance désignée", 20, yPosition);
    return yPosition + layout.lineHeight * 2;
  }
  
  trustedPersons.forEach((person, index) => {
    pdf.setFont("helvetica", "bold");
    
    // Utiliser name si disponible, sinon utiliser first_name et last_name
    let personName = person.name || '';
    if (!personName && (person.first_name || person.last_name)) {
      personName = `${person.first_name || ''} ${person.last_name || ''}`.trim();
    }
    
    pdf.text(`Personne ${index + 1}: ${personName}`, 20, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Lien: ${person.relation || person.relationship || 'Non renseigné'}`, 30, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Téléphone: ${person.phone || 'Non renseigné'}`, 30, yPosition);
    yPosition += layout.lineHeight;
    
    pdf.text(`Email: ${person.email || 'Non renseigné'}`, 30, yPosition);
    yPosition += layout.lineHeight;
    
    if (person.address) {
      pdf.text(`Adresse: ${person.address}`, 30, yPosition);
      yPosition += layout.lineHeight;
      
      if (person.city || person.postal_code) {
        pdf.text(`${person.postal_code || ''} ${person.city || ''}`.trim(), 30, yPosition);
        yPosition += layout.lineHeight;
      }
    }
    
    yPosition += layout.lineHeight * 0.5;
  });
  
  return yPosition;
};

export const renderPhrases = (pdf: jsPDF, layout: PdfLayout, yPosition: number, phrases: string[], title: string): number => {
  if (!phrases || phrases.length === 0) {
    return yPosition;
  }
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(title.toUpperCase(), 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  phrases.forEach(phrase => {
    // Check if we need a new page
    yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 3);
    
    const phraseLines = pdf.splitTextToSize(phrase, layout.contentWidth);
    pdf.text(phraseLines, 20, yPosition);
    yPosition += phraseLines.length * layout.lineHeight + layout.lineHeight / 2;
  });
  
  return yPosition + layout.lineHeight;
};

export const renderFreeText = (pdf: jsPDF, layout: PdfLayout, yPosition: number, freeText: string): number => {
  if (!freeText || freeText.trim() === '') {
    return yPosition;
  }
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("COMMENTAIRES PERSONNELS", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  const textLines = pdf.splitTextToSize(freeText, layout.contentWidth);
  pdf.text(textLines, 20, yPosition);
  
  return yPosition + textLines.length * layout.lineHeight + layout.lineHeight;
};
