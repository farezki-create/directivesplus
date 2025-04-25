
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { cardDimensions } from "./utils/constants/cardDimensions";

export class PDFDocumentGenerator {
  /**
   * Generate a PDF document with the provided data
   * @param profile User profile information
   * @param responses Questionnaire responses
   * @param trustedPersons List of trusted persons
   * @returns A data URL for the generated PDF
   */
  static async generate(
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[]
  ): Promise<string | null> {
    try {
      console.log("[PDFDocumentGenerator] Generating PDF document");
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add content to the PDF (this is a placeholder - the real implementation would be more complex)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Directives Anticipées", 105, 20, { align: "center" });
      
      // Add user information
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Nom: ${profile.last_name || ""}`, 20, 40);
      doc.text(`Prénom: ${profile.first_name || ""}`, 20, 50);
      doc.text(`Date de naissance: ${profile.birth_date || ""}`, 20, 60);
      
      // Add trusted persons if any
      if (trustedPersons && trustedPersons.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Personnes de confiance:", 20, 80);
        doc.setFont("helvetica", "normal");
        
        let yPos = 90;
        trustedPersons.forEach((person, index) => {
          doc.text(`${index + 1}. ${person.name}`, 25, yPos);
          yPos += 10;
        });
      }
      
      // Return the PDF as a data URL
      return doc.output('dataurlstring');
    } catch (error) {
      console.error("[PDFDocumentGenerator] Error generating PDF:", error);
      return null;
    }
  }
}
