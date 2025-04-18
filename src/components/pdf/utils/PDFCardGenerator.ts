
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

      console.log("[PDFCardGenerator] Document PDF généré avec succès");
      
      // Approche progressive pour générer un PDF valide
      try {
        // 1. Générer comme ArrayBuffer (plus fiable)
        console.log("[PDFCardGenerator] Création d'un ArrayBuffer de PDF");
        const pdfOutput = doc.output('arraybuffer');
        console.log(`[PDFCardGenerator] PDF ArrayBuffer créé: taille=${pdfOutput.byteLength} octets`);
        
        if (pdfOutput.byteLength === 0) {
          throw new Error("Le PDF généré est vide (ArrayBuffer)");
        }
        
        // 2. Créer un Blob avec le type MIME correct
        console.log("[PDFCardGenerator] Création d'un Blob PDF depuis ArrayBuffer");
        const pdfBlob = new Blob([pdfOutput], { type: 'application/pdf' });
        console.log(`[PDFCardGenerator] Blob PDF créé: taille=${pdfBlob.size} octets, type=${pdfBlob.type}`);
        
        if (pdfBlob.size === 0) {
          throw new Error("Le PDF généré est vide (Blob)");
        }
        
        // 3. Créer une URL Blob sécurisée
        console.log("[PDFCardGenerator] Création d'une URL Blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        console.log(`[PDFCardGenerator] URL Blob créée: ${blobUrl}`);
        
        return blobUrl;
      } catch (blobError) {
        console.error("[PDFCardGenerator] Erreur lors de la génération du PDF comme blob:", blobError);
        
        // Approche alternative en cas d'échec
        console.log("[PDFCardGenerator] Tentative avec output en 'blob'");
        try {
          const blob = doc.output('blob');
          console.log(`[PDFCardGenerator] Blob direct créé: taille=${blob.size} octets, type=${blob.type}`);
          
          if (blob.size === 0) {
            throw new Error("Le blob PDF généré est vide");
          }
          
          // Vérifier le type MIME et corriger si nécessaire
          const pdfBlob = blob.type === 'application/pdf' 
            ? blob 
            : new Blob([blob], { type: 'application/pdf' });
          
          const blobUrl = URL.createObjectURL(pdfBlob);
          console.log(`[PDFCardGenerator] URL Blob créée (méthode alternative): ${blobUrl}`);
          return blobUrl;
        } catch (directBlobError) {
          console.error("[PDFCardGenerator] Échec de génération du blob direct:", directBlobError);
          
          // Dernière tentative avec dataURL
          console.log("[PDFCardGenerator] Tentative finale avec dataURL");
          const dataUrl = doc.output('dataurlstring');
          
          if (!dataUrl.startsWith('data:application/pdf')) {
            console.log("[PDFCardGenerator] Correction du type MIME dans dataURL");
            const base64Data = dataUrl.split(',')[1];
            const correctedDataUrl = `data:application/pdf;base64,${base64Data}`;
            console.log(`[PDFCardGenerator] DataURL corrigée créée`);
            return correctedDataUrl;
          }
          
          console.log(`[PDFCardGenerator] DataURL créée: ${dataUrl.substring(0, 50)}...`);
          return dataUrl;
        }
      }
    } catch (error) {
      console.error("[PDFCardGenerator] Erreur globale lors de la génération PDF:", error);
      throw new Error("Impossible de générer le PDF: " + (error as Error).message);
    }
  }
}
