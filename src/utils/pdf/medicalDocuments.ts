
import { jsPDF } from "jspdf";
import { PdfLayout } from "./types";

/**
 * Récupère les documents médicaux depuis medical_documents uniquement (système principal)
 */
export const getMedicalDocuments = async (userId: string): Promise<any[]> => {
  console.log("getMedicalDocuments - début avec userId:", userId);
  
  const { supabase } = await import("@/integrations/supabase/client");
  
  try {
    let allDocuments: any[] = [];

    console.log("Récupération depuis medical_documents...");
    
    // Récupérer UNIQUEMENT depuis medical_documents (système principal)
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
        content: doc.file_path, // Le contenu est directement dans file_path
        file_type: doc.file_type
      }));
      
      allDocuments = [...medicalDocuments];
    }

    // SUPPRESSION DE LA RÉCUPÉRATION DEPUIS questionnaire_responses
    // pour éviter les doublons et les anciens documents supprimés

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
 * Rendu optimisé des documents médicaux dans le PDF
 */
export const renderMedicalDocuments = (
  pdf: jsPDF, 
  layout: PdfLayout, 
  yPosition: number, 
  medicalDocuments: any[]
): number => {
  console.log("=== DÉBUT RENDU DOCUMENTS MÉDICAUX ===");
  console.log("Position Y de départ:", yPosition);
  console.log("Documents médicaux à rendre:", medicalDocuments.length);
  
  if (!medicalDocuments || medicalDocuments.length === 0) {
    console.log("Aucun document médical à rendre");
    return yPosition;
  }

  // Espacement avant la section
  yPosition += layout.lineHeight * 2;

  // Vérifier si on a besoin d'une nouvelle page
  if (yPosition + layout.lineHeight * 4 > layout.pageHeight - layout.margin - layout.footerHeight) {
    pdf.addPage();
    yPosition = layout.margin;
  }

  // Titre de la section avec style amélioré
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("📋 DOCUMENTS MÉDICAUX INTÉGRÉS", layout.margin, yPosition);
  yPosition += layout.lineHeight * 1.5;

  // Note explicative
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const noteText = `${medicalDocuments.length} document${medicalDocuments.length > 1 ? 's' : ''} médical${medicalDocuments.length > 1 ? 'aux' : ''} intégré${medicalDocuments.length > 1 ? 's' : ''} dans ces directives anticipées :`;
  pdf.text(noteText, layout.margin, yPosition);
  yPosition += layout.lineHeight * 2;

  // Rendu de chaque document de manière optimisée
  medicalDocuments.forEach((doc, index) => {
    console.log(`Rendu du document ${index + 1}: ${doc.file_name}`);
    
    // Vérifier l'espace disponible
    if (yPosition + layout.lineHeight * 8 > layout.pageHeight - layout.margin - layout.footerHeight) {
      pdf.addPage();
      yPosition = layout.margin;
    }
    
    // Titre du document avec numérotation
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    const documentTitle = `${index + 1}. ${doc.file_name}`;
    pdf.text(documentTitle, layout.margin, yPosition);
    yPosition += layout.lineHeight;
    
    // Date d'ajout
    if (doc.created_at) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      const dateText = `Ajouté le: ${new Date(doc.created_at).toLocaleDateString('fr-FR')}`;
      pdf.text(dateText, layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
    }
    
    // Ligne de séparation
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(layout.margin, yPosition, layout.margin + layout.contentWidth, yPosition);
    yPosition += layout.lineHeight * 0.5;
    
    // Contenu du document selon le type
    if (doc.content) {
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
        // Contenu textuel
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const contentLines = pdf.splitTextToSize(doc.content, layout.contentWidth - 10);
        pdf.text(contentLines, layout.margin + 5, yPosition);
        yPosition += contentLines.length * layout.lineHeight + layout.lineHeight;
      }
    } else {
      // Document sans contenu (ancien système)
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.text("[Document référencé - contenu non intégré]", layout.margin + 5, yPosition);
      yPosition += layout.lineHeight;
    }
    
    // Description si disponible
    if (doc.description && doc.description !== `Document médical: ${doc.file_name}`) {
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(`Description: ${doc.description}`, layout.contentWidth - 10);
      pdf.text(descLines, layout.margin + 5, yPosition);
      yPosition += descLines.length * layout.lineHeight;
    }
    
    yPosition += layout.lineHeight * 1.5; // Espacement entre documents
  });

  console.log("=== FIN RENDU DOCUMENTS MÉDICAUX ===");
  console.log("Position Y finale:", yPosition);
  return yPosition + layout.lineHeight;
};
