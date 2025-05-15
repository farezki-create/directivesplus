
import { jsPDF } from "jspdf";
import { formatDate } from "./helpers";

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

export const addSignature = (doc: jsPDF, name: string, date: Date, startY: number) => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Signé par: ${name}`, 20, startY);
  doc.text(`Date: ${formatDate(date)}`, 20, startY + 10);
  return startY + 20;
};

export const addSections = (doc: jsPDF, sections: import("./types").SectionData[], startY: number) => {
  let currentY = startY;
  sections.forEach(section => {
    currentY = addSectionTitle(doc, section.title, currentY);
    currentY = addSectionContent(doc, section.content, currentY);
  });
  return currentY;
};
