
import { jsPDF } from "jspdf";
import { UserProfile, TrustedPerson } from "../types";
import { cardDimensions, pageLayout } from "./constants/cardDimensions";
import { CardContentGenerator } from "./generators/CardContentGenerator";
import { InstructionsGenerator } from "./generators/InstructionsGenerator";

export class PDFCardGenerator {
  static async generate(profile: UserProfile, trustedPersons: TrustedPerson[]) {
    console.log("[PDFCardGenerator] Début de la génération du PDF double-carte pliable");
    
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    try {
      console.log("[PDFCardGenerator] Configuration du document PDF");
      
      // Generate the first card (Directives Anticipées)
      CardContentGenerator.generateCardContent(
        doc,
        "CARTE DIRECTIVES ANTICIPÉES",
        pageLayout.margin,
        pageLayout.cardsStartY,
        profile,
        true,
        trustedPersons
      );
      
      // Generate the second card (Documents Médicaux)
      CardContentGenerator.generateCardContent(
        doc,
        "CARTE DOCUMENTS MÉDICAUX",
        pageLayout.margin * 2 + cardDimensions.width,
        pageLayout.cardsStartY,
        profile,
        false,
        trustedPersons
      );

      // Add folding instructions
      InstructionsGenerator.addFoldingInstructions(doc);

      // Add usage instructions
      InstructionsGenerator.addUsageInstructions(
        doc,
        pageLayout.margin,
        pageLayout.cardsStartY + cardDimensions.height
      );

      console.log("[PDFCardGenerator] Document PDF généré avec succès, création du Blob");
      
      // Approche progressive pour générer un PDF valide et vérifier à chaque étape
      // 1. Générer comme ArrayBuffer
      const pdfOutput = doc.output('arraybuffer');
      console.log(`[PDFCardGenerator] PDF ArrayBuffer créé: taille=${pdfOutput.byteLength} octets`);
      
      // 2. Créer un Blob avec le type MIME correct
      const pdfBlob = new Blob([pdfOutput], { type: 'application/pdf' });
      console.log(`[PDFCardGenerator] Blob PDF créé: taille=${pdfBlob.size} octets, type=${pdfBlob.type}`);
      
      if (pdfBlob.size === 0) {
        throw new Error("Le PDF généré est vide");
      }
      
      // 3. Créer une URL Blob sécurisée
      const blobUrl = URL.createObjectURL(pdfBlob);
      console.log(`[PDFCardGenerator] URL Blob créée: ${blobUrl}`);
      
      return blobUrl;
    } catch (error) {
      console.error("[PDFCardGenerator] Erreur lors de la génération du PDF comme blob:", error);
      
      // Approche alternative en cas d'échec
      try {
        console.log("[PDFCardGenerator] Tentative de génération via dataURL");
        const dataUrl = doc.output('dataurlstring');
        
        if (!dataUrl.startsWith('data:application/pdf')) {
          console.log("[PDFCardGenerator] Correction du type MIME dans dataURL");
          const base64Data = dataUrl.split(',')[1];
          const correctedDataUrl = `data:application/pdf;base64,${base64Data}`;
          return correctedDataUrl;
        }
        
        console.log("[PDFCardGenerator] Génération en dataURL réussie");
        return dataUrl;
      } catch (fallbackError) {
        console.error("[PDFCardGenerator] Échec complet de la génération PDF:", fallbackError);
        throw new Error("Impossible de générer le PDF: " + (fallbackError as Error).message);
      }
    }
  }
}
