
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux de l'utilisateur
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    const { data, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des documents médicaux:', error);
      return [];
    }

    return data || [];
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
  if (!medicalDocuments || medicalDocuments.length === 0) {
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
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    
    const documentInfo = `${index + 1}. ${doc.file_name || 'Document médical'}`;
    pdf.text(documentInfo, layout.margin + 5, yPosition);
    yPosition += layout.lineHeight;
    
    if (doc.description) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const description = `   Description: ${doc.description}`;
      pdf.text(description, layout.margin + 10, yPosition);
      yPosition += layout.lineHeight;
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

  return yPosition + layout.lineHeight;
};
