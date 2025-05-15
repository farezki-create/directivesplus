
import { jsPDF } from "jspdf";
import { ContactPerson } from "./types";

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
