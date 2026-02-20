
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

export const renderQuestionnaires = (pdf: jsPDF, layout: PdfLayout, yPosition: number, responses: Record<string, any>, translateResponse: (response: string) => string): number => {
  if (!responses || Object.keys(responses).length === 0) {
    return yPosition;
  }
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("RÉPONSES AUX QUESTIONNAIRES", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  
  // Fonction pour obtenir le titre français du questionnaire
  const getQuestionnaireTitle = (type: string) => {
    switch (type) {
      case 'avis-general':
        return "Avis Général";
      case 'maintien-vie':
        return "Maintien en Vie";
      case 'maladie-avancee':
        return "Maladie Avancée";
      case 'gouts-peurs':
        return "Goûts et Préférences";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Parcourir chaque type de questionnaire
  Object.entries(responses).forEach(([questionnaireType, questions]) => {
    // Vérifier si nous avons des questions pour ce type
    if (!questions || typeof questions !== 'object' || Object.keys(questions).length === 0) {
      return;
    }
    
    // Vérifier s'il faut une nouvelle page
    yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 4);
    
    // Titre du questionnaire
    pdf.setFont("helvetica", "bold");
    pdf.text(getQuestionnaireTitle(questionnaireType), 20, yPosition);
    yPosition += layout.lineHeight * 1.2;
    
    // Parcourir chaque question
    Object.entries(questions).forEach(([questionId, questionData]: [string, any]) => {
      // Vérifier s'il faut une nouvelle page
      yPosition = checkPageBreak(pdf, layout, yPosition, layout.lineHeight * 3);
      
      // Afficher la question
      pdf.setFont("helvetica", "bold");
      const questionText = questionData.question || `Question ${questionId}`;
      const questionLines = pdf.splitTextToSize(`Q: ${questionText}`, layout.contentWidth - 20);
      pdf.text(questionLines, 25, yPosition);
      yPosition += questionLines.length * layout.lineHeight;
      
      // Afficher la réponse
      pdf.setFont("helvetica", "normal");
      const responseText = questionData.response || "Pas de réponse";
      const translatedResponse = translateResponse(responseText);
      const responseLines = pdf.splitTextToSize(`R: ${translatedResponse}`, layout.contentWidth - 40);
      pdf.text(responseLines, 35, yPosition);
      yPosition += responseLines.length * layout.lineHeight + layout.lineHeight * 0.5;
    });
    
    yPosition += layout.lineHeight; // Espacement entre les questionnaires
  });
  
  return yPosition + layout.lineHeight;
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

export const renderSignature = (pdf: jsPDF, layout: PdfLayout, yPosition: number, signature: string): number => {
  if (!signature) {
    return yPosition;
  }
  
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("SIGNATURE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  
  // Add signature date
  pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
  yPosition += layout.lineHeight * 2;
  
  // Add signature confirmation text
  pdf.text("Je certifie que les informations ci-dessus reflètent mes volontés.", 20, yPosition);
  yPosition += layout.lineHeight * 2;
  
  // Add signature placeholder or actual signature
  if (signature.startsWith('data:image')) {
    try {
      pdf.addImage(signature, 'PNG', 20, yPosition, 60, 30);
      yPosition += 35;
    } catch (error) {
      console.error('Error adding signature image:', error);
      pdf.text("Signature électronique capturée", 20, yPosition);
      yPosition += layout.lineHeight;
    }
  } else {
    pdf.text("Signature électronique capturée", 20, yPosition);
    yPosition += layout.lineHeight;
  }
  
  return yPosition + layout.lineHeight;
};
