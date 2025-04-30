
import { jsPDF } from "jspdf";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

/**
 * Hook for generating PDF documents from medical questionnaire data
 */
export function usePDFGeneration() {
  const generatePDF = (data: MedicalQuestionnaireData) => {
    // Generate PDF
    const pdfDoc = new jsPDF();

    // Add title
    pdfDoc.setFontSize(18);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("Questionnaire médical préalable", 105, 20, { align: "center" });
    pdfDoc.setFontSize(12);
    pdfDoc.setFont("helvetica", "normal");

    // Section 1: Informations générales
    let y = 40;
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("1. Informations générales", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    pdfDoc.text(`Nom: ${data.nom}`, 25, y);
    y += 8;
    pdfDoc.text(`Prénom: ${data.prenom}`, 25, y);
    y += 8;
    pdfDoc.text(`Date de naissance: ${data.date_naissance}`, 25, y);
    y += 8;
    pdfDoc.text(`Sexe: ${data.sexe}`, 25, y);
    y += 8;
    if (data.secu) {
      pdfDoc.text(`Numéro de sécurité sociale: ${data.secu}`, 25, y);
      y += 8;
    }
    if (data.adresse) {
      pdfDoc.text(`Adresse: ${data.adresse}`, 25, y);
      y += 8;
    }
    if (data.telephone) {
      pdfDoc.text(`Téléphone: ${data.telephone}`, 25, y);
      y += 8;
    }
    if (data.personne_prevenir) {
      pdfDoc.text(`Personne à prévenir: ${data.personne_prevenir}`, 25, y);
      y += 8;
    }

    y += 5;

    // Add remaining sections (similar pattern)
    // Section 2
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("2. Motif de consultation", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.motif) {
      pdfDoc.text(`Motif principal: ${data.motif}`, 25, y);
      y += 8;
    }
    if (data.debut_symptomes) {
      pdfDoc.text(`Début des symptômes: ${data.debut_symptomes}`, 25, y);
      y += 8;
    }
    if (data.evolution) {
      pdfDoc.text(`Évolution: ${data.evolution}`, 25, y);
      y += 8;
    }

    y += 5;

    // Check if we need a new page
    if (y > 250) {
      pdfDoc.addPage();
      y = 20;
    }

    // Section 3
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("3. Symptômes associés", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.symptomes && data.symptomes.length > 0) {
      pdfDoc.text(`Symptômes: ${data.symptomes.join(', ')}`, 25, y);
      y += 8;
    }
    if (data.autres_symptomes) {
      pdfDoc.text(`Autres symptômes: ${data.autres_symptomes}`, 25, y);
      y += 8;
    }

    y += 5;

    // Section 4
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("4. Antécédents médicaux", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    
    if (data.pathologies && data.pathologies.length > 0) {
      pdfDoc.text(`Pathologies connues: ${data.pathologies.join(', ')}`, 25, y);
      y += 8;
    }
    
    if (data.antecedents) {
      pdfDoc.text(`Autres pathologies: ${data.antecedents}`, 25, y);
      y += 8;
    }
    
    if (data.chirurgies && data.chirurgies.length > 0) {
      pdfDoc.text(`Chirurgies antérieures: ${data.chirurgies.join(', ')}`, 25, y);
      y += 8;
    }
    
    if (data.autres_chirurgies) {
      pdfDoc.text(`Autres chirurgies: ${data.autres_chirurgies}`, 25, y);
      y += 8;
    }
    
    if (data.hospitalisations) {
      pdfDoc.text(`Hospitalisations récentes: ${data.hospitalisations}`, 25, y);
      y += 8;
    }

    y += 5;

    // Check if we need a new page
    if (y > 250) {
      pdfDoc.addPage();
      y = 20;
    }

    // Section 5
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("5. Allergies", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    
    if (data.allergies && data.allergies.length > 0) {
      pdfDoc.text(`Allergies connues: ${data.allergies.join(', ')}`, 25, y);
      y += 8;
    }
    
    if (data.autres_allergies) {
      pdfDoc.text(`Autres allergies: ${data.autres_allergies}`, 25, y);
      y += 8;
    }

    y += 5;

    // Continue adding remaining sections...
    // Section 6
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("6. Traitements en cours", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.traitements) {
      pdfDoc.text(`Médicaments habituels: ${data.traitements}`, 25, y);
      y += 8;
    }

    y += 5;

    // Check if we need a new page
    if (y > 250) {
      pdfDoc.addPage();
      y = 20;
    }

    // Section 7
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("7. Antécédents familiaux", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.famille && data.famille.length > 0) {
      pdfDoc.text(`Antécédents familiaux: ${data.famille.join(', ')}`, 25, y);
      y += 8;
    }

    y += 5;

    // Section 8
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("8. Mode de vie", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.tabac) {
      pdfDoc.text(`Fumeur: ${data.tabac}`, 25, y);
      y += 8;
    }
    if (data.alcool) {
      pdfDoc.text(`Alcool: ${data.alcool}`, 25, y);
      y += 8;
    }
    if (data.drogues) {
      pdfDoc.text(`Drogues: ${data.drogues}`, 25, y);
      y += 8;
    }
    if (data.activite_physique) {
      pdfDoc.text(`Activité physique: ${data.activite_physique}`, 25, y);
      y += 8;
    }

    y += 5;

    // Section 9 - Supprimé car contexte social est à supprimer

    // Check if we need a new page
    if (y > 250) {
      pdfDoc.addPage();
      y = 20;
    }

    // Section 10 (maintenant Section 9 après suppression)
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.text("9. Particularités", 20, y);
    pdfDoc.setFont("helvetica", "normal");
    y += 10;
    if (data.dispositifs) {
      pdfDoc.text(`Dispositifs médicaux implantés: ${data.dispositifs}`, 25, y);
      y += 8;
    }
    if (data.directives) {
      pdfDoc.text(`Directives anticipées ou personne de confiance: ${data.directives}`, 25, y);
      y += 8;
    }

    return pdfDoc.output('dataurlstring');
  };

  return { generatePDF };
}
