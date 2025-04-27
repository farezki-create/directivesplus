
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "./types";
import { cardDimensions } from "./utils/constants/cardDimensions";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { SignatureHandler } from "./utils/SignatureHandler";

export class PDFDocumentGenerator {
  static async generate(
    profile: UserProfile,
    responses: any,
    trustedPersons: TrustedPerson[],
    isCard: boolean = false
  ): Promise<string | null> {
    try {
      console.log("[PDFDocumentGenerator] Generating PDF document", isCard ? "as card format" : "as full document");
      console.log("[PDFDocumentGenerator] Profile:", profile);
      
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
        
        // Add access information
        doc.setFontSize(8);
        doc.text("Accès à vos directives:", 10, 40);
        doc.text("www.directivesplus.fr", cardDimensions.width / 2, 45, { align: "center" });
        
        // Add access code at bottom
        doc.setFontSize(7);
        doc.text(`Code d'accès professionnel: ${profile.unique_identifier || ""}`, cardDimensions.width / 2, cardDimensions.height - 5, { align: "center" });
      } else {
        // Generate full document format
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Directives Anticipées", 105, 20, { align: "center" });
        
        // Add user information with complete address
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Nom: ${profile.last_name || ""}`, 20, 40);
        doc.text(`Prénom: ${profile.first_name || ""}`, 20, 50);
        doc.text(`Date de naissance: ${profile.birth_date || ""}`, 20, 60);

        let yPos = 70;

        // Add address information if available
        if (profile.address || profile.postal_code || profile.city || profile.country) {
          doc.setFont("helvetica", "bold");
          doc.text("Adresse:", 20, yPos);
          doc.setFont("helvetica", "normal");
          yPos += 10;

          if (profile.address) {
            doc.text(profile.address, 25, yPos);
            yPos += 10;
          }

          // Combine postal code and city on the same line if both exist
          if (profile.postal_code || profile.city) {
            const locationLine = [profile.postal_code, profile.city]
              .filter(Boolean)
              .join(" ");
            if (locationLine) {
              doc.text(locationLine, 25, yPos);
              yPos += 10;
            }
          }

          if (profile.country) {
            doc.text(profile.country, 25, yPos);
            yPos += 10;
          }
        }

        yPos += 10; // Add some spacing before trusted persons section

        // Add trusted persons if any
        if (trustedPersons && trustedPersons.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.text("Personnes de confiance:", 20, yPos);
          doc.setFont("helvetica", "normal");
          
          yPos += 10;
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
          
          // Add a new page for questionnaire responses
          doc.addPage();
          yPos = 20;
        }
        
        // Add questionnaire responses using PDFResponsesSection
        if (responses) {
          console.log("[PDFDocumentGenerator] Adding questionnaire responses");
          let newYPos = PDFResponsesSection.generate(doc, responses, yPos);
          
          if (newYPos > yPos) {
            newYPos += 20;
          }
          
          // Add synthesis if available on a new page
          if (responses && responses.synthesis && responses.synthesis.free_text) {
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
        
        // Add signature to each page and a larger one at the end
        await SignatureHandler.applySignature(doc, profile);
        
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
