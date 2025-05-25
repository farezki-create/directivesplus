
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux depuis les questionnaires
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    console.log("Récupération des documents médicaux depuis les questionnaires pour userId:", userId);
    
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .eq('questionnaire_type', 'medical-documents')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des documents médicaux:', error);
      return [];
    }

    // Transformer les données des questionnaires en format de documents
    const documents = data?.map(item => ({
      id: item.question_id,
      file_name: item.question_text,
      description: item.response,
      created_at: item.created_at,
      user_id: item.user_id
    })) || [];

    console.log("Documents médicaux trouvés depuis les questionnaires:", documents.length, documents);
    return documents;
  } catch (error) {
    console.error('Erreur lors de la récupération des documents médicaux:', error);
    return [];
  }
};

/**
 * Ajoute les documents médicaux au PDF
 */
export const renderMedicalDocuments = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  yPosition: number, 
  medicalDocuments: any[]
): number => {
  console.log("Début du rendu des documents médicaux, position Y:", yPosition);
  console.log("Documents à rendre:", medicalDocuments);
  
  if (!medicalDocuments || medicalDocuments.length === 0) {
    console.log("Aucun document médical à rendre");
    return yPosition;
  }

  // Titre de la section
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Documents médicaux de synthèse", layout.margin, yPosition);
  yPosition += layout.lineHeight * 2;

  // Ajout d'une note explicative
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const noteText = "Les documents médicaux suivants complètent ces directives anticipées :";
  pdf.text(noteText, layout.margin, yPosition);
  yPosition += layout.lineHeight * 2;

  // Liste des documents médicaux
  medicalDocuments.forEach((doc, index) => {
    console.log(`Rendu du document ${index + 1}:`, doc);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const documentInfo = `${index + 1}. ${doc.file_name || 'Document médical'}`;
    pdf.text(documentInfo, layout.margin + 5, yPosition);
    yPosition += layout.lineHeight;
    
    if (doc.description) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const description = `   ${doc.description}`;
      const descriptionLines = pdf.splitTextToSize(description, layout.contentWidth - 15);
      pdf.text(descriptionLines, layout.margin + 10, yPosition);
      yPosition += descriptionLines.length * layout.lineHeight;
    }
    
    // Date d'ajout
    if (doc.created_at) {
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      const dateText = `   Ajouté le: ${new Date(doc.created_at).toLocaleDateString('fr-FR')}`;
      pdf.text(dateText, layout.margin + 10, yPosition);
      yPosition += layout.lineHeight;
    }
    
    yPosition += layout.lineHeight * 0.5; // Espacement entre les documents
  });

  console.log("Fin du rendu des documents médicaux, position Y finale:", yPosition);
  return yPosition + layout.lineHeight;
};
