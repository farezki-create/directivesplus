
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

// Helper function to format date
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Helper function to check if page break is needed
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
