import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserProfile, TrustedPerson } from "./types";

export class PDFDocumentGenerator {
  static generate(profile: UserProfile, responses: any, trustedPersons: TrustedPerson[]) {
    console.log("[PDFGenerator] Generating PDF with responses:", responses);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.text("Directives Anticipées", pageWidth / 2, yPosition, { align: "center" });
    
    // User information
    yPosition += 20;
    doc.setFontSize(12);
    if (profile) {
      doc.text(`${profile.first_name} ${profile.last_name}`, 20, yPosition);
      yPosition += 10;
      if (profile.address) {
        doc.text(profile.address, 20, yPosition);
        yPosition += 7;
      }
      if (profile.postal_code || profile.city) {
        doc.text(`${profile.postal_code || ""} ${profile.city || ""}`, 20, yPosition);
        yPosition += 7;
      }
      if (profile.phone_number) {
        doc.text(`Tél: ${profile.phone_number}`, 20, yPosition);
        yPosition += 7;
      }
    }

    // Access code
    yPosition += 10;
    doc.setFontSize(14);
    doc.text("Code d'accès pour les professionnels de santé:", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    if (profile?.unique_identifier) {
      doc.text(profile.unique_identifier, 20, yPosition);
    }

    // General Responses
    if (responses?.general && responses.general.length > 0) {
      yPosition += 20;
      doc.setFontSize(14);
      doc.text("Mon avis d'une façon générale:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.general.forEach((response: any) => {
        const text = `${response.question_text || response.questions?.Question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Life Support Responses
    if (responses?.lifeSupport && responses.lifeSupport.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Maintien en vie:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.lifeSupport.forEach((response: any) => {
        const text = `${response.question_text || response.life_support_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Advanced Illness Responses
    if (responses?.advancedIllness && responses.advancedIllness.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Maladie avancée:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.advancedIllness.forEach((response: any) => {
        const text = `${response.question_text || response.advanced_illness_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Preferences Responses
    if (responses?.preferences && responses.preferences.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Mes goûts et mes peurs:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      responses.preferences.forEach((response: any) => {
        const text = `${response.question_text || response.preferences_questions?.question}: ${response.response}`;
        const lines = doc.splitTextToSize(text, pageWidth - 40);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 7;
      });
    }

    // Synthesis
    if (responses?.synthesis?.free_text) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Synthèse et expression libre:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      const synthesisText = responses.synthesis.free_text;
      const lines = doc.splitTextToSize(synthesisText, pageWidth - 40);
      doc.text(lines, 20, yPosition);
      yPosition += lines.length * 7;
    }

    // Trusted persons
    if (trustedPersons.length > 0) {
      yPosition += 15;
      doc.setFontSize(14);
      doc.text("Personne(s) de confiance:", 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      trustedPersons.forEach((person, index) => {
        doc.text(`${index + 1}. ${person.name}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Tél: ${person.phone}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Email: ${person.email}`, 20, yPosition);
        yPosition += 7;
        doc.text(`   Relation: ${person.relation}`, 20, yPosition);
        yPosition += 10;
      });
    }

    // Date and signature
    yPosition += 15;
    const currentDate = format(new Date(), "d MMMM yyyy", { locale: fr });
    doc.text(`Fait le ${currentDate} à `, 20, yPosition);
    yPosition += 20;
    doc.text("Signature:", 20, yPosition);

    return doc.output('dataurlstring');
  }
}