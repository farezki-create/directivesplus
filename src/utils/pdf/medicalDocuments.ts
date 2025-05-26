
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux depuis medical_documents uniquement
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  console.log("getMedicalDocuments - début avec userId:", userId);
  
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    console.log("Récupération depuis medical_documents...");
    
    // Récupérer uniquement depuis medical_documents (système principal)
    const { data: medicalDocs, error: medicalError } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (medicalError) {
      console.error('Erreur lors de la récupération des documents médicaux:', medicalError);
      return [];
    }

    if (!medicalDocs || medicalDocs.length === 0) {
      console.log("Aucun document médical trouvé");
      return [];
    }

    console.log("Documents trouvés dans medical_documents:", medicalDocs.length);
    
    const medicalDocuments = medicalDocs.map(doc => ({
      id: doc.id,
      file_name: doc.file_name,
      description: doc.description || `Document médical: ${doc.file_name}`,
      created_at: doc.created_at,
      user_id: doc.user_id,
      content: doc.extracted_content || '', // Utiliser le contenu extrait
      file_type: doc.file_type,
      file_path: doc.file_path,
      extracted_content: doc.extracted_content
    }));
    
    console.log("Total des documents médicaux récupérés:", medicalDocuments.length);
    console.log("Documents avec contenu extrait:", medicalDocuments.filter(d => d.extracted_content).length);
    
    return medicalDocuments;

  } catch (error) {
    console.error('Erreur lors de la récupération des documents médicaux:', error);
    return [];
  }
};

/**
 * Rendu du chapitre des documents médicaux avec nouvelle page et titre de chapitre
 */
export const renderMedicalDocumentsChapter = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  medicalDocuments: any[]
): void => {
  console.log("=== DÉBUT CHAPITRE DOCUMENTS MÉDICAUX ===");
  console.log("Documents médicaux à rendre:", medicalDocuments.length);
  
  if (!medicalDocuments || medicalDocuments.length === 0) {
    console.log("Aucun document médical à rendre");
    return;
  }

  // Ajouter une nouvelle page pour le chapitre des documents médicaux
  pdf.addPage();
  let yPosition = layout.margin;

  // Titre du chapitre avec style distinct
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("CHAPITRE 2", layout.pageWidth / 2, yPosition, { align: "center" });
  yPosition += layout.lineHeight * 1.5;

  pdf.setFontSize(18);
  pdf.text("DOCUMENTS MÉDICAUX ANNEXES", layout.pageWidth / 2, yPosition, { align: "center" });
  yPosition += layout.lineHeight * 3;

  // Ligne de séparation décorative
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(1);
  pdf.line(layout.margin, yPosition, layout.margin + layout.contentWidth, yPosition);
  yPosition += layout.lineHeight * 2;

  // Introduction du chapitre
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  const introText = `Ce chapitre présente les ${medicalDocuments.length} document${medicalDocuments.length > 1 ? 's' : ''} médical${medicalDocuments.length > 1 ? 'aux' : ''} annexe${medicalDocuments.length > 1 ? 's' : ''} joint${medicalDocuments.length > 1 ? 's' : ''} aux directives anticipées pour compléter et préciser les volontés exprimées.`;
  const introLines = pdf.splitTextToSize(introText, layout.contentWidth);
  pdf.text(introLines, layout.margin, yPosition);
  yPosition += introLines.length * layout.lineHeight + layout.lineHeight * 2;

  // Rendu de chaque document
  medicalDocuments.forEach((doc, index) => {
    console.log(`Rendu du document ${index + 1}: ${doc.file_name}`, {
      hasExtractedContent: !!doc.extracted_content,
      contentLength: doc.extracted_content ? doc.extracted_content.length : 0,
      fileType: doc.file_type
    });
    
    // Vérifier l'espace disponible pour un nouveau document
    if (yPosition + layout.lineHeight * 15 > layout.pageHeight - layout.margin - layout.footerHeight) {
      pdf.addPage();
      yPosition = layout.margin;
    }
    
    // Titre du document avec numérotation
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    const documentTitle = `Document ${index + 1}: ${doc.file_name || 'Document sans titre'}`;
    pdf.text(documentTitle, layout.margin, yPosition);
    yPosition += layout.lineHeight * 1.2;
    
    // Date d'ajout et informations
    if (doc.created_at) {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(100, 100, 100);
      const dateText = `Ajouté le: ${new Date(doc.created_at).toLocaleDateString('fr-FR')}`;
      pdf.text(dateText, layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
    }
    
    // Ligne de séparation pour le document
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.3);
    pdf.line(layout.margin, yPosition, layout.margin + layout.contentWidth, yPosition);
    yPosition += layout.lineHeight * 0.8;
    
    // Réinitialiser la couleur du texte
    pdf.setTextColor(0, 0, 0);
    
    // Affichage du contenu extrait ou message par défaut
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    
    if (doc.extracted_content && doc.extracted_content.trim()) {
      console.log(`Ajout du contenu extrait pour ${doc.file_name}`);
      
      // Afficher le contenu extrait
      const contentLines = pdf.splitTextToSize(doc.extracted_content, layout.contentWidth - 10);
      
      // Vérifier si on a assez d'espace pour le contenu
      const neededHeight = contentLines.length * layout.lineHeight;
      if (yPosition + neededHeight > layout.pageHeight - layout.margin - layout.footerHeight) {
        pdf.addPage();
        yPosition = layout.margin;
      }
      
      pdf.text(contentLines, layout.margin + 5, yPosition);
      yPosition += contentLines.length * layout.lineHeight;
    } else {
      console.log(`Pas de contenu extrait pour ${doc.file_name}`);
      
      // Message indiquant qu'aucun contenu n'a été extrait
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(150, 150, 150);
      const noContentText = "Contenu du document non extrait. Le document original est disponible en annexe.";
      const noContentLines = pdf.splitTextToSize(noContentText, layout.contentWidth - 10);
      pdf.text(noContentLines, layout.margin + 5, yPosition);
      yPosition += noContentLines.length * layout.lineHeight;
      pdf.setTextColor(0, 0, 0);
    }
    
    // Description si disponible et différente du nom
    if (doc.description && doc.description !== `Document médical: ${doc.file_name}` && doc.description !== doc.file_name) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      const descLines = pdf.splitTextToSize(`Description: ${doc.description}`, layout.contentWidth - 10);
      pdf.text(descLines, layout.margin + 5, yPosition);
      yPosition += descLines.length * layout.lineHeight;
      pdf.setTextColor(0, 0, 0);
    }
    
    yPosition += layout.lineHeight * 2; // Espacement entre documents
  });

  console.log("=== FIN CHAPITRE DOCUMENTS MÉDICAUX ===");
};

/**
 * Fonction de compatibilité pour l'ancien système
 */
export const renderMedicalDocuments = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  yPosition: number, 
  medicalDocuments: any[]
): number => {
  // Maintenant on utilise le système de chapitre
  renderMedicalDocumentsChapter(pdf, layout, medicalDocuments);
  return yPosition; // La position n'est plus pertinente car on crée une nouvelle page
};
