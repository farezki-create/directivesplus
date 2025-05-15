import jsPDF from 'jspdf';

// Define the PDF layout interface
export interface PdfLayout {
  margin: number;
  pageWidth: number;
  pageHeight: number;
  lineHeight: number;
  contentWidth: number;
  footerHeight: number;
}

interface SectionData {
  title: string;
  content: string | string[];
}

interface ContactPerson {
  firstName: string;
  lastName: string;
  relationship: string;
  phone: string;
  email: string;
}

interface HealthcareDirective {
  directive: string;
}

interface QuestionResponse {
  question: string;
  response: string;
}

export const addHeader = (doc: jsPDF, text: string) => {
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(text, 20, 15);
};

export const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  doc.setFontSize(10);
  doc.setTextColor(150);
  const footerText = `Page ${pageNumber} / ${totalPages}`;
  const xPosition = doc.internal.pageSize.getWidth() - 45;
  doc.text(footerText, xPosition, doc.internal.pageSize.getHeight() - 10);
};

export const addTitle = (doc: jsPDF, title: string) => {
  doc.setFontSize(24);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 40);
};

export const addSectionTitle = (doc: jsPDF, title: string, startY: number) => {
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, startY);
  return startY + 10;
};

export const addSectionContent = (doc: jsPDF, content: string | string[], startY: number) => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);

  if (typeof content === 'string') {
    const textLines = doc.splitTextToSize(content, doc.internal.pageSize.getWidth() - 40);
    doc.text(textLines, 20, startY);
    return startY + (textLines.length * 7);
  } else if (Array.isArray(content)) {
    let currentY = startY;
    content.forEach(item => {
      const textLines = doc.splitTextToSize(item, doc.internal.pageSize.getWidth() - 40);
      doc.text(textLines, 20, currentY);
      currentY += (textLines.length * 7) + 5;
    });
    return currentY;
  }

  return startY;
};

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const addSignature = (doc: jsPDF, name: string, date: Date, startY: number) => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Signé par: ${name}`, 20, startY);
  doc.text(`Date: ${formatDate(date)}`, 20, startY + 10);
  return startY + 20;
};

export const addSections = (doc: jsPDF, sections: SectionData[], startY: number) => {
  let currentY = startY;
  sections.forEach(section => {
    currentY = addSectionTitle(doc, section.title, currentY);
    currentY = addSectionContent(doc, section.content, currentY);
  });
  return currentY;
};

export const formatContactPersonsSection = (doc: jsPDF, contactPersons: ContactPerson[], startY: number): number => {
  let currentY = startY;

  if (!contactPersons || contactPersons.length === 0) {
    return currentY;
  }

  // Add section title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Personnes à contacter", 20, currentY);
  currentY += 10;

  // Reset to normal text
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Add each contact person
  contactPersons.forEach((person) => {
    // Check available space
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    // Add contact person details
    doc.setFont("helvetica", "bold");
    doc.text(`${person.firstName} ${person.lastName} (${person.relationship})`, 20, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.text(`Téléphone: ${person.phone}`, 20, currentY);
    currentY += 7;
    doc.text(`Email: ${person.email}`, 20, currentY);
    currentY += 12;
  });

  return currentY;
};

export const formatHealthcareDirectivesSection = (doc: jsPDF, healthcareDirectives: HealthcareDirective[], startY: number): number => {
  let currentY = startY;

  if (!healthcareDirectives || healthcareDirectives.length === 0) {
    return currentY;
  }

  // Add section title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Mes directives de soins", 20, currentY);
  currentY += 10;

  // Reset to normal text
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Add each healthcare directive
  healthcareDirectives.forEach((directive) => {
    // Check available space
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }

    // Add directive text
    const directiveLines = doc.splitTextToSize(directive.directive, 170);
    doc.text(directiveLines, 20, currentY);
    currentY += directiveLines.length * 7 + 5;
  });

  return currentY;
};

export const formatQuestionnairesSection = (doc: jsPDF, questionnairesData: QuestionResponse[], startY: number): number => {
  let currentY = startY;
  
  if (!questionnairesData || questionnairesData.length === 0) {
    return currentY;
  }

  // Add section title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Mes réponses au questionnaire", 20, currentY);
  currentY += 10;

  // Reset to normal text
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  // Add each question and response
  questionnairesData.forEach((item) => {
    // Type assertion to address the error
    const questionItem = item as QuestionResponse;
    
    // Check available space
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add question
    doc.setFont("helvetica", "bold");
    doc.text(questionItem.question, 20, currentY);
    currentY += 8;
    
    // Add response
    doc.setFont("helvetica", "normal");
    const responseLines = doc.splitTextToSize(questionItem.response, 170);
    doc.text(responseLines, 20, currentY);
    currentY += responseLines.length * 7 + 5;
  });

  return currentY;
};

// Add the missing functions required by pdfGenerator.ts
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

export const renderQuestionnaires = (
  pdf: jsPDF,
  layout: PdfLayout,
  yPosition: number,
  responses: Record<string, any>,
  translateResponse: (response: string) => string
): number => {
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("RÉPONSES AU QUESTIONNAIRE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  let currentY = yPosition;
  
  // Check if responses object is empty
  if (!responses || Object.keys(responses).length === 0) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Aucune réponse au questionnaire", 20, currentY);
    return currentY + layout.lineHeight * 2;
  }
  
  // Process each questionnaire section
  for (const [section, questions] of Object.entries(responses)) {
    let sectionTitle = "";
    
    switch(section) {
      case 'avis-general':
        sectionTitle = "Avis Général";
        break;
      case 'maintien-vie':
        sectionTitle = "Maintien en Vie";
        break;
      case 'maladie-avancee':
        sectionTitle = "Maladie Avancée";
        break;
      case 'gouts-peurs':
        sectionTitle = "Goûts et Peurs";
        break;
      default:
        sectionTitle = section;
    }
    
    // Add section title
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    currentY = checkPageBreak(pdf, layout, currentY, layout.lineHeight * 2);
    pdf.text(sectionTitle, 20, currentY);
    currentY += layout.lineHeight * 1.5;
    
    // Add questions and responses
    pdf.setFontSize(12);
    
    for (const [questionId, item] of Object.entries(questions as Record<string, {response: string, question: string}>)) {
      // Check if we need a new page
      currentY = checkPageBreak(pdf, layout, currentY, layout.lineHeight * 4);
      
      // Add question
      pdf.setFont("helvetica", "bold");
      const questionLines = pdf.splitTextToSize(item.question, layout.contentWidth);
      pdf.text(questionLines, 20, currentY);
      currentY += questionLines.length * layout.lineHeight;
      
      // Add response
      pdf.setFont("helvetica", "normal");
      const translatedResponse = translateResponse(item.response);
      pdf.text(`Réponse: ${translatedResponse}`, 30, currentY);
      currentY += layout.lineHeight * 1.5;
    }
    
    // Add spacing between sections
    currentY += layout.lineHeight;
  }
  
  return currentY;
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
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("SIGNATURE", 20, yPosition);
  
  yPosition += layout.lineHeight * 1.5;
  
  // Add the signature image if available
  if (signature) {
    try {
      pdf.addImage(signature, 'PNG', 20, yPosition, 60, 30);
      yPosition += 35;
      
      // Add date below signature
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);
      yPosition += layout.lineHeight;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la signature:", error);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "italic");
      pdf.text("Signature numérique non disponible", 20, yPosition);
      yPosition += layout.lineHeight * 2;
    }
  } else {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "italic");
    pdf.text("Pas de signature", 20, yPosition);
    yPosition += layout.lineHeight * 2;
  }
  
  return yPosition;
};

export const addSignatureFooter = (pdf: jsPDF, layout: PdfLayout, signature: string): void => {
  if (!signature) return;
  
  const footerY = layout.pageHeight - layout.footerHeight;
  
  try {
    // Add a small version of the signature at the bottom of the page
    pdf.addImage(signature, 'PNG', 20, footerY, 30, 15);
    
    // Add date next to signature
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Document signé le ${new Date().toLocaleDateString('fr-FR')}`, 55, footerY + 10);
    
    // Add page numbers
    const pageNumber = pdf.getCurrentPageInfo().pageNumber;
    const totalPages = pdf.getNumberOfPages();
    pdf.text(`Page ${pageNumber}/${totalPages}`, layout.pageWidth - 40, footerY + 10);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la signature au pied de page:", error);
  }
};

// Helper function to check if page break is needed and add new page if necessary
export const checkPageBreak = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  yPosition: number, 
  heightNeeded: number = layout.lineHeight * 5
): number => {
  if (yPosition + heightNeeded > layout.pageHeight - layout.margin - layout.footerHeight) {
    pdf.addPage();
    return layout.margin;
  }
  return yPosition;
};
