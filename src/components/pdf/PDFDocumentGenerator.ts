
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
        // Set background color for the card
        doc.setFillColor(248, 250, 252); // Light gray background
        doc.rect(0, 0, cardDimensions.width, cardDimensions.height, 'F');

        // Add header with gradient background
        doc.setFillColor(99, 102, 241); // Indigo color
        doc.rect(0, 0, cardDimensions.width, 15, 'F');
        
        // Header text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255); // White text
        doc.text("CARTE D'ACCÈS AUX DIRECTIVES ANTICIPÉES", cardDimensions.width / 2, 8, { align: "center" });
        
        // Add user information in card format with better spacing
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55); // Dark gray text
        
        const startY = 22;
        const lineHeight = 5;
        
        // Labels and values in two columns
        doc.text("Nom:", 6, startY);
        doc.setFont("helvetica", "normal");
        doc.text(profile.last_name || "", 20, startY);
        
        doc.setFont("helvetica", "bold");
        doc.text("Prénom:", 6, startY + lineHeight);
        doc.setFont("helvetica", "normal");
        doc.text(profile.first_name || "", 20, startY + lineHeight);
        
        doc.setFont("helvetica", "bold");
        doc.text("Date de naissance:", 6, startY + (lineHeight * 2));
        doc.setFont("helvetica", "normal");
        doc.text(profile.birth_date || "", 32, startY + (lineHeight * 2));
        
        // Add access information with improved styling
        doc.setFillColor(243, 244, 246); // Light gray background
        doc.roundedRect(6, 38, cardDimensions.width - 12, 10, 1, 1, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(31, 41, 55);
        doc.text("Accès à vos directives:", cardDimensions.width / 2, 43, { align: "center" });
        
        // Website URL with better styling
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(79, 70, 229); // Indigo color for URL
        doc.text("www.directivesplus.fr", cardDimensions.width / 2, 48, { align: "center" });
        
        // Add professional access code at bottom with a subtle background
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(4, cardDimensions.height - 10, cardDimensions.width - 8, 7, 1, 1, 'F');
        
        doc.setFontSize(7);
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.text("Code d'accès professionnel:", 6, cardDimensions.height - 5);
        doc.setFont("helvetica", "normal");
        const accessCode = profile.unique_identifier || "";
        doc.text(accessCode, 45, cardDimensions.height - 5);
        
        // Add decorative elements
        doc.setDrawColor(99, 102, 241); // Indigo color
        doc.setLineWidth(0.5);
        doc.line(4, 35, cardDimensions.width - 4, 35);
        
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
