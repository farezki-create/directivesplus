
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux depuis les questionnaires
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  console.log("getMedicalDocuments - début avec userId:", userId);
  
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    console.log("Requête vers questionnaire_responses pour documents médicaux...");
    
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .eq('questionnaire_type', 'medical-documents')
      .order('created_at', { ascending: false });

    console.log("Résultat de la requête:", { data, error });

    if (error) {
      console.error('Erreur lors de la récupération des documents médicaux:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("Aucun document médical trouvé dans questionnaire_responses");
      return [];
    }

    // Transformer les données des questionnaires en format de documents
    const documents = data.map(item => ({
      id: item.question_id,
      file_name: item.question_text,
      description: item.response,
      created_at: item.created_at,
      user_id: item.user_id
    }));

    console.log("Documents médicaux transformés:", documents);
    return documents;
  } catch (error) {
    console.error('Erreur lors de la récupération des documents médicaux:', error);
    return [];
  }
};

/**
 * Ajoute les documents médicaux au PDF à la fin du document
 */
export const renderMedicalDocuments = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  yPosition: number, 
  medicalDocuments: any[]
): number => {
  console.log("=== DÉBUT RENDU DOCUMENTS MÉDICAUX ===");
  console.log("Position Y de départ:", yPosition);
  console.log("Documents médicaux à rendre:", medicalDocuments);
  
  if (!medicalDocuments || medicalDocuments.length === 0) {
    console.log("Aucun document médical à rendre - tableau vide ou null");
    return yPosition;
  }

  // Espacement avant la section
  yPosition += layout.lineHeight * 2;

  // Vérifier si on a besoin d'une nouvelle page pour le titre
  if (yPosition + layout.lineHeight * 3 > layout.pageHeight - layout.margin - layout.footerHeight) {
    console.log("Nouvelle page nécessaire pour le titre des documents médicaux");
    pdf.addPage();
    yPosition = layout.margin;
  }

  // Titre de la section
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("DOCUMENTS MÉDICAUX", layout.margin, yPosition);
  yPosition += layout.lineHeight * 2;

  // Ajout d'une note explicative
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  const noteText = "Les documents médicaux suivants complètent ces directives anticipées :";
  pdf.text(noteText, layout.margin, yPosition);
  yPosition += layout.lineHeight * 2;

  // Liste des documents médicaux
  medicalDocuments.forEach((doc, index) => {
    console.log(`Rendu du document médical ${index + 1}:`, doc);
    
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition + layout.lineHeight * 4 > layout.pageHeight - layout.margin - layout.footerHeight) {
      console.log(`Nouvelle page nécessaire pour le document ${index + 1}`);
      pdf.addPage();
      yPosition = layout.margin;
    }
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    
    const documentTitle = `${index + 1}. ${doc.file_name || 'Document médical'}`;
    console.log(`Ajout du titre: ${documentTitle}`);
    pdf.text(documentTitle, layout.margin, yPosition);
    yPosition += layout.lineHeight * 1.5;
    
    if (doc.description) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const description = doc.description;
      const descriptionLines = pdf.splitTextToSize(description, layout.contentWidth - 10);
      console.log(`Ajout de la description: ${description}`);
      pdf.text(descriptionLines, layout.margin + 5, yPosition);
      yPosition += descriptionLines.length * layout.lineHeight + layout.lineHeight * 0.5;
    }
    
    // Date d'ajout
    if (doc.created_at) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const dateText = `Ajouté le: ${new Date(doc.created_at).toLocaleDateString('fr-FR')}`;
      console.log(`Ajout de la date: ${dateText}`);
      pdf.text(dateText, layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
    }
    
    yPosition += layout.lineHeight; // Espacement entre les documents
  });

  console.log("=== FIN RENDU DOCUMENTS MÉDICAUX ===");
  console.log("Position Y finale:", yPosition);
  return yPosition + layout.lineHeight;
};
