import jsPDF from 'jspdf';

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
