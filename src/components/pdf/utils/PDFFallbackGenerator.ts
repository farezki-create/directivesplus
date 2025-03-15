
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";

/**
 * Generates a simplified PDF with minimal content when the standard generator fails
 */
export const generateSimplifiedPDF = async (profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) => {
  console.log("[PDFGeneration] Trying simplified PDF generation");
  const { jsPDF } = await import("jspdf");
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Add minimal content
  doc.setFontSize(18);
  doc.text("Directives Anticipées", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(`${profile.first_name} ${profile.last_name}`, 105, 40, { align: "center" });
  
  doc.setFontSize(12);
  if (responses.synthesis?.free_text) {
    doc.text("Mes directives:", 20, 60);
    const lines = doc.splitTextToSize(responses.synthesis.free_text, 170);
    doc.text(lines, 20, 70);
  }
  
  return doc.output('dataurlstring');
};

/**
 * Generates an extremely basic PDF with just user info as a last resort
 */
export const generateBasicPDF = async (profile: UserProfile) => {
  console.log("[PDFGeneration] Trying basic PDF generation");
  const { jsPDF } = await import("jspdf");
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Just add the essentials
  doc.setFontSize(18);
  doc.text("Directives Anticipées", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.text(`${profile.first_name} ${profile.last_name}`, 105, 40, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Ce document n'a pas pu être généré complètement.", 20, 60);
  doc.text("Veuillez contacter le support technique.", 20, 70);
  
  return doc.output('dataurlstring');
};

/**
 * Opens a print window with formatted content as a fallback
 */
export const openPrintWindow = (profile: UserProfile | null, responses: any) => {
  if (!profile) return null;
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) return null;
  
  let content = `
    <html>
      <head>
        <title>Directives Anticipées - ${profile.first_name} ${profile.last_name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; font-size: 16px; }
          .content { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Directives Anticipées</h1>
        <div class="section">
          <div class="section-title">Identité:</div>
          <div class="content">
            ${profile.first_name} ${profile.last_name}<br/>
            ${profile.birth_date ? `Né(e) le: ${profile.birth_date}<br/>` : ''}
            ${profile.email ? `Email: ${profile.email}<br/>` : ''}
          </div>
        </div>
  `;
  
  // Add synthesis if available
  if (responses.synthesis?.free_text) {
    content += `
      <div class="section">
        <div class="section-title">Mes directives:</div>
        <div class="content">
          ${responses.synthesis.free_text.replace(/\n/g, '<br/>')}
        </div>
      </div>
    `;
  }
  
  content += `
      </body>
    </html>
  `;
  
  printWindow.document.write(content);
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
  
  return printWindow;
};
