
import { jsPDF } from "jspdf";
import { HealthcareDirective } from "./types";

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
