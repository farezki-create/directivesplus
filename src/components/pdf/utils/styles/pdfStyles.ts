
import { jsPDF } from "jspdf";

export const pdfStyles = {
  setHeaderStyle: (doc: jsPDF) => {
    doc.setFillColor(70, 70, 120);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
  },
  
  setContentStyle: (doc: jsPDF) => {
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
  },
  
  setInstructionStyle: (doc: jsPDF) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
  },
  
  setTitleStyle: (doc: jsPDF) => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
  }
} as const;
