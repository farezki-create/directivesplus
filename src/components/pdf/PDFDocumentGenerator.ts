
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";
import { PDFUserSection } from "./utils/PDFUserSection";
import { PDFTrustedPersonSection } from "./utils/PDFTrustedPersonSection";
import { PDFResponsesSection } from "./utils/PDFResponsesSection";
import { supabase } from "@/integrations/supabase/client";

export class PDFDocumentGenerator {
  static async generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with profile:", profile);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Définir les marges
    const margin = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    };

    // Configuration initiale du document
    doc.setProperties({
      title: "Directives Anticipées",
      subject: "Directives Anticipées",
      author: profile ? `${profile.first_name} ${profile.last_name}` : "Non spécifié",
      keywords: "directives anticipées, santé",
      creator: "Application Directives Anticipées"
    });

    let yPosition = margin.top;

    // === PAGE 1 ===
    // En-tête avec titre principal (taille réduite)
    doc.setFontSize(20); // Réduction de la taille du titre
    doc.setFont("helvetica", "bold");
    doc.text(
      "Directives Anticipées",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15; // Réduction de l'espacement

    // Sous-titre avec la date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const dateStr = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Document établi le ${dateStr}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 20;

    // Informations d'identité
    if (profile) {
      yPosition = PDFUserSection.generate(doc, profile, yPosition);
    } else {
      console.warn("[PDFGenerator] No profile data available");
      doc.setFontSize(12);
      doc.text("Information d'identité non disponible", margin.left, yPosition);
      yPosition += 15;
    }

    // Section des directives
    if (responses?.type !== "trusted_person") {
      yPosition += 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Mes directives anticipées", margin.left, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 10;
      yPosition = PDFResponsesSection.generate(doc, responses, yPosition);
    }

    // === PAGE 2 ===
    doc.addPage();
    yPosition = margin.top;

    // Section Personne de confiance
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Personne de confiance",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    doc.setFont("helvetica", "normal");
    yPosition += 15;
    yPosition = PDFTrustedPersonSection.generate(doc, trustedPersons, yPosition);

    // Section signature
    yPosition += 30;
    doc.setFontSize(12);
    
    // Section "Je soussigné(e)" centrée
    doc.text(
      "Je soussigné(e)",
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 10;
    
    // Nom complet centré
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    doc.text(
      fullName,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;
    
    // Date et lieu centrés
    const today = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(
      `Fait le ${today} à ${profile?.city || '................................'}`,
      doc.internal.pageSize.getWidth() / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Récupérer la signature depuis la base de données
    console.log("[PDFGenerator] Fetching signature for user:", profile.id);
    const { data: signatureData } = await supabase
      .from('user_signatures')
      .select('signature_data')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (signatureData?.signature_data) {
      // Ajouter la signature à chaque page
      const totalPages = doc.internal.pages.length;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Ajouter la signature en bas de page
        const pageHeight = doc.internal.pageSize.getHeight();
        const signatureHeight = 20; // hauteur en mm pour la signature
        
        // Ajouter la signature
        doc.addImage(
          signatureData.signature_data,
          'PNG',
          margin.left,
          pageHeight - margin.bottom - signatureHeight,
          30, // largeur de la signature en mm
          signatureHeight
        );

        // Ajouter le texte à côté de la signature
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Signé par ${fullName} le ${today}`,
          margin.left + 35,
          pageHeight - margin.bottom - signatureHeight / 2
        );
      }
    }

    // Numérotation des pages
    const totalPages = doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i}/${totalPages}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    return doc.output('dataurlstring');
  }
}
