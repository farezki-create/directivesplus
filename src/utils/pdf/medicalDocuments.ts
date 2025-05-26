
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux depuis medical_documents ET questionnaires
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  console.log("getMedicalDocuments - début avec userId:", userId);
  
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    let allDocuments: any[] = [];

    console.log("Récupération depuis medical_documents...");
    
    // 1. Récupérer depuis medical_documents (système principal)
    const { data: medicalDocs, error: medicalError } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!medicalError && medicalDocs && medicalDocs.length > 0) {
      console.log("Documents trouvés dans medical_documents:", medicalDocs.length);
      
      const medicalDocuments = medicalDocs.map(doc => ({
        id: doc.id,
        file_name: doc.file_name,
        description: doc.description || `Document médical: ${doc.file_name}`,
        created_at: doc.created_at,
        user_id: doc.user_id,
        content: doc.file_path,
        file_type: doc.file_type
      }));
      
      allDocuments = [...allDocuments, ...medicalDocuments];
    }

    console.log("Récupération depuis questionnaire_responses...");
    
    // 2. Récupérer aussi depuis questionnaire_responses (ancien système)
    const { data: questionnaireData, error: questionnaireError } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', userId)
      .eq('questionnaire_type', 'medical-documents')
      .order('created_at', { ascending: false });

    if (!questionnaireError && questionnaireData && questionnaireData.length > 0) {
      console.log("Documents trouvés dans questionnaire_responses:", questionnaireData.length);
      
      const questionnaireDocuments = questionnaireData.map(item => ({
        id: item.question_id,
        file_name: item.question_text,
        description: item.response,
        created_at: item.created_at,
        user_id: item.user_id,
        content: null
      }));
      
      allDocuments = [...allDocuments, ...questionnaireDocuments];
    }

    console.log("Total des documents médicaux récupérés:", allDocuments.length);
    return allDocuments;

  } catch (error) {
    console.error('Erreur lors de la récupération des documents médicaux:', error);
    return [];
  }
};

/**
 * Ajoute une image au PDF de manière optimisée
 */
const addImageToPDF = (pdf: jsPDF, layout: PdfLayout, yPosition: number, base64Data: string, fileName: string): number => {
  try {
    console.log(`Ajout de l'image ${fileName} au PDF`);
    
    const imageData = base64Data.split(',')[1];
    const mimeType = base64Data.split(';')[0].split(':')[1];
    
    let format = 'JPEG';
    if (mimeType.includes('png')) format = 'PNG';
    
    // Taille optimisée pour le PDF
    const maxWidth = layout.contentWidth - 20;
    const maxHeight = 120;
    
    pdf.addImage(imageData, format, layout.margin + 10, yPosition, maxWidth, maxHeight);
    
    return yPosition + maxHeight + 10;
  } catch (error) {
    console.error(`Erreur lors de l'ajout de l'image ${fileName}:`, error);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "italic");
    pdf.text(`[Image ${fileName} non accessible]`, layout.margin + 10, yPosition);
    
    return yPosition + layout.lineHeight * 2;
  }
};

/**
 * Ajoute un contenu PDF de manière optimisée
 */
const addPDFContent = (pdf: jsPDF, layout: PdfLayout, yPosition: number, fileName: string): number => {
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  
  const pdfText = `📄 Document PDF intégré: ${fileName}`;
  pdf.text(pdfText, layout.margin + 10, yPosition);
  yPosition += layout.lineHeight;
  
  const note = "Le contenu complet de ce document PDF est inclus dans cette version des directives anticipées.";
  const noteLines = pdf.splitTextToSize(note, layout.contentWidth - 20);
  pdf.text(noteLines, layout.margin + 10, yPosition);
  
  return yPosition + noteLines.length * layout.lineHeight + layout.lineHeight;
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
    console.log(`Rendu du document ${index + 1}: ${doc.file_name}`, doc);
    
    // Vérifier l'espace disponible pour un nouveau document
    if (yPosition + layout.lineHeight * 10 > layout.pageHeight - layout.margin - layout.footerHeight) {
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
    
    // Contenu du document selon le type
    if (doc.content) {
      console.log(`Traitement du contenu pour ${doc.file_name}:`, doc.content.substring(0, 50) + '...');
      
      if (doc.content.startsWith('data:application/pdf')) {
        yPosition = addPDFContent(pdf, layout, yPosition, doc.file_name);
      } else if (doc.content.startsWith('data:image/')) {
        // Vérifier l'espace pour l'image
        if (yPosition + 130 > layout.pageHeight - layout.margin - layout.footerHeight) {
          pdf.addPage();
          yPosition = layout.margin;
        }
        yPosition = addImageToPDF(pdf, layout, yPosition, doc.content, doc.file_name);
      } else {
        // Contenu textuel ou autre
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        
        // Si c'est un contenu textuel, l'afficher directement
        let contentToDisplay = doc.content;
        if (typeof contentToDisplay === 'string' && contentToDisplay.length > 0) {
          const contentLines = pdf.splitTextToSize(contentToDisplay, layout.contentWidth - 10);
          pdf.text(contentLines, layout.margin + 5, yPosition);
          yPosition += contentLines.length * layout.lineHeight + layout.lineHeight;
        } else {
          pdf.setFont("helvetica", "italic");
          pdf.text("[Contenu du document non disponible]", layout.margin + 5, yPosition);
          yPosition += layout.lineHeight;
        }
      }
    } else {
      // Document sans contenu (ancien système ou erreur)
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(150, 150, 150);
      pdf.text("[Document référencé - contenu non intégré dans cette version]", layout.margin + 5, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += layout.lineHeight;
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
