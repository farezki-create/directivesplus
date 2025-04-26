
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { cardDimensions } from "./utils/constants/cardDimensions";

export class PDFDocumentGenerator {
  /**
   * Generate a PDF document with the provided data
   * @param profile User profile information
   * @param responses Questionnaire responses
   * @param trustedPersons List of trusted persons
   * @param isCard Whether to generate a card format PDF
   * @returns A data URL for the generated PDF
   */
  static async generate(
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[],
    isCard: boolean = false
  ): Promise<string | null> {
    try {
      console.log("[PDFDocumentGenerator] Generating PDF document", isCard ? "as card format" : "as full document");
      
      // Create a new PDF document with appropriate format
      const doc = isCard 
        ? new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [cardDimensions.width, cardDimensions.height]
          })
        : new jsPDF();
      
      if (isCard) {
        // Generate card format
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("CARTE D'ACCÈS AUX DIRECTIVES ANTICIPÉES", cardDimensions.width / 2, 10, { align: "center" });
        
        // Add user information in card format
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Nom: ${profile.last_name || ""}`, 10, 20);
        doc.text(`Prénom: ${profile.first_name || ""}`, 10, 25);
        doc.text(`Date de naissance: ${profile.birth_date || ""}`, 10, 30);
        
        // Add unique identifier at bottom
        doc.setFontSize(7);
        doc.text(`ID: ${profile.unique_identifier || ""}`, cardDimensions.width / 2, cardDimensions.height - 5, { align: "center" });
      } else {
        // Generate full document format
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
      }
      
      // Return the PDF as a data URL
      return doc.output('dataurlstring');
    } catch (error) {
      console.error("[PDFDocumentGenerator] Error generating PDF:", error);
      return null;
    }
  }
}
