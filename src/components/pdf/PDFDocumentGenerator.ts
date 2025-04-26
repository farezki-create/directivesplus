
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { cardDimensions } from "./utils/constants/cardDimensions";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";

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
      console.log("[PDFDocumentGenerator] Profile:", profile);
      console.log("[PDFDocumentGenerator] Responses:", responses);
      console.log("[PDFDocumentGenerator] Trusted persons:", trustedPersons);
      
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
            doc.text(`${index + 1}. ${person.name || "Non renseigné"}`, 25, yPos);
            yPos += 10;
            
            if (person.phone) {
              doc.text(`   Tél: ${person.phone}`, 25, yPos);
              yPos += 10;
            }
            
            if (person.email) {
              doc.text(`   Email: ${person.email}`, 25, yPos);
              yPos += 10;
            }
          });
          
          // Ajouter une nouvelle page pour les réponses aux questionnaires
          doc.addPage();
          yPos = 20;  // Réinitialise la position Y pour la nouvelle page
        } else {
          // Si pas de personnes de confiance, continuer sur la même page
          let yPos = 100;
        }
        
        // Ajouter les réponses aux questionnaires en utilisant PDFResponsesSection
        if (responses) {
          // Utiliser PDFResponsesSection pour ajouter les réponses au document
          console.log("[PDFDocumentGenerator] Ajout des réponses aux questionnaires");
          let newYPos = PDFResponsesSection.generate(doc, responses, 30);
          
          // Si des réponses ont été ajoutées, laissez de l'espace avant la synthèse
          if (newYPos > 30) {
            newYPos += 20;
          }
          
          // Add synthesis if available on a new page
          if (responses && responses.synthesis && responses.synthesis.free_text) {
            // Vérifier si nous avons besoin d'une nouvelle page pour la synthèse
            if (newYPos > doc.internal.pageSize.getHeight() - 60) {
              doc.addPage();
              newYPos = 30;
            }
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Synthèse", 20, newYPos);
            newYPos += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            
            const synthesisText = responses.synthesis.free_text;
            const splitText = doc.splitTextToSize(synthesisText, 170);
            doc.text(splitText, 20, newYPos);
          }
        }
        
        // Add page numbers
        const pageCount = doc.internal.pages.length;
        for (let i = 1; i < pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.text(`Page ${i} / ${pageCount - 1}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
        }
      }
      
      // Return the PDF as a data URL
      const output = doc.output('dataurlstring');
      console.log("[PDFDocumentGenerator] PDF generated successfully, data URL length:", output.length);
      return output;
    } catch (error) {
      console.error("[PDFDocumentGenerator] Error generating PDF:", error);
      return null;
    }
  }
}
